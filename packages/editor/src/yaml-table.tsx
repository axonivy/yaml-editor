import {
    VSCodeButton,
    VSCodeCheckbox,
    VSCodeDataGrid,
    VSCodeDataGridCell,
    VSCodeDataGridRow,
    VSCodeTextField
} from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import { WebviewApi } from 'vscode-webview';
import * as YAML from 'yaml';
import './codicon.css';
import './yaml-table.css';

interface YAMLVariablesTableProps {
    vscodeApi?: WebviewApi<unknown>;
}

const EMPTY_YAML = YAML.parseDocument('');

export default function YAMLVariablesTable(props: YAMLVariablesTableProps) {
    const [yaml, setYaml] = useState(EMPTY_YAML);

    // const tst = `
    // k1: "asdads"
    // k2: "sasdasd"
    // k3:
    //   c1: 10
    // k4: 101
    // `;
    const tst = 'a: "asdads"';

    const d = YAML.parseDocument(tst);
    d.add(d.createPair('', 111));
    const j = d.toJS();
    console.log(d, j);

    useEffect(() => {
        if (!props.vscodeApi) {
            let parsedYaml = EMPTY_YAML;
            const config = localStorage.getItem('config');
            if (config) {
                parsedYaml = YAML.parseDocument(config);
            }
            setYaml(parsedYaml);
            return;
        }
        window.addEventListener('message', (event) => {
            const message = event.data;
            let text = message.text;
            if (message.type === 'update') {
                try {
                    if (!text) {
                        setYaml(EMPTY_YAML);
                        return;
                    }
                    const parsedYaml = YAML.parseDocument(text);
                    setYaml(parsedYaml);
                } catch {
                    setYaml(EMPTY_YAML);
                }
            }
        });
    }, [props]);

    return (
        <main id='webview-body'>
            <h1>YAML Variables Table Editor</h1>
            <VSCodeDataGrid grid-template-columns='48% 48% 4%' aria-label='Default'>
                <VSCodeDataGridRow row-type='sticky-header'>
                    <VSCodeDataGridCell cell-type='columnheader' grid-column='1'>
                        Key
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell cell-type='columnheader' grid-column='2'>
                        Value
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell cell-type='columnheader' grid-column='3' />
                </VSCodeDataGridRow>
                {yaml.toJS()
                    ? Object.entries(yaml.toJS()).map(([key, value]) =>
                          renderDataGrid(key, value, [])
                      )
                    : null}
                <section style={{ justifyContent: 'flex-end' }} className='edit-button-container'>
                    {renderAddButton([])}
                    {renderAddParentNodeButton([])}
                </section>
            </VSCodeDataGrid>
        </main>
    );

    function renderDataGrid(key: string, value: any, parentKeys: string[]) {
        const valueType = typeof value;
        if (valueType === 'object') {
            return renderParentNode(key, value, parentKeys);
        }
        return renderLeafNode(key, value, parentKeys);
    }

    function renderParentNode(key: string, value: any, parentKeys: string[]) {
        return (
            <VSCodeDataGrid grid-template-columns='48% 48% 4%' aria-label='Default'>
                <VSCodeDataGridRow>
                    <VSCodeTextField
                        style={{ paddingLeft: 10 * parentKeys.length }}
                        grid-column='1'
                        currentValue={key}
                        onChange={(e) => handleVariableKeyChange(e, key, parentKeys)}
                    />
                    <section className='edit-button-container'>
                        {renderAddButton([...parentKeys, key])}
                        {renderAddParentNodeButton([...parentKeys, key])}
                    </section>
                    <section className='edit-button-container'>
                        {renderDeleteButton(key, parentKeys)}
                    </section>
                </VSCodeDataGridRow>
                {Object.entries(value).map(([childKey, childValue]) =>
                    renderDataGrid(childKey, childValue, [...parentKeys, key])
                )}
            </VSCodeDataGrid>
        );
    }

    function renderLeafNode(key: string, value: any, parentKeys: string[]) {
        return (
            <VSCodeDataGridRow rowType='default'>
                <VSCodeTextField
                    style={{ paddingLeft: 10 * parentKeys.length }}
                    grid-column='1'
                    currentValue={key}
                    onChange={(e) => handleVariableKeyChange(e, key, parentKeys)}
                />
                {renderVariableValueElement(value, key, parentKeys)}
                <section grid-column='3' className='edit-button-container'>
                    {renderDeleteButton(key, parentKeys)}
                </section>
            </VSCodeDataGridRow>
        );
    }

    function renderVariableValueElement(value: any, key: string, parentKeys: string[]) {
        const valueType = typeof value;

        if (valueType === 'string' || valueType === 'number') {
            return (
                <VSCodeTextField
                    grid-column='2'
                    currentValue={value}
                    onChange={(e) => handleVariableValueChange(e, key, parentKeys)}
                />
            );
        }
        if (valueType === 'boolean') {
            return (
                <VSCodeCheckbox
                    grid-column='2'
                    currentChecked={value}
                    onClick={(e) => handleVariableValueClick(e, key, parentKeys)}
                />
            );
        }
        return <VSCodeTextField grid-column='2' readOnly={true} />;
    }

    function handleAddParentNodeClick(
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        parentKeys: string[]
    ) {
        e.preventDefault();

        if (e.target) {
            const tmpYaml = Object.assign({}, yaml);
            const parentNode = resolveParentNode(tmpYaml, parentKeys);
            parentNode[''] = {};
            updateYamlDocument(tmpYaml);
        }
    }

    function handleVariableKeyChange(e: Event, variableKey: string, parentKeys: string[]) {
        e.preventDefault();
        if (e.target) {
            const tmpYaml = yaml.clone();
            const value = tmpYaml.getIn([...parentKeys, variableKey]);
            tmpYaml.addIn([...parentKeys, e.target['value']], value);
            tmpYaml.deleteIn([...parentKeys, variableKey]);
            props.vscodeApi?.postMessage({ type: 'updateDocument', text: tmpYaml.toString() });
            updateYamlDocument(tmpYaml);
        }
    }

    function handleVariableValueChange(e: Event, variableKey: string, parentKeys: string[]) {
        e.preventDefault();
        if (e.target) {
            // guess type of changed value
            const changedValue = e.target['value'];
            let newValue;
            if (/^(true|false)$/i.test(changedValue)) {
                // check if value is boolean
                newValue = changedValue.toLowerCase() === 'true';
            } else if (
                !isNaN(changedValue) &&
                (parseInt(changedValue) || parseFloat(changedValue))
            ) {
                // check if value is numeric
                newValue = +changedValue;
            } else {
                // otherwise handle as string
                newValue = changedValue;
            }
            const tmpYaml = yaml.clone();
            tmpYaml.setIn([...parentKeys, variableKey], newValue);
            updateYamlDocument(tmpYaml);
        }
    }

    function handleVariableValueClick(
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        variableKey: string,
        parentKeys: string[]
    ) {
        e.preventDefault();
        if (e.target) {
            const tmpYaml = yaml.clone();
            tmpYaml.setIn([...parentKeys, variableKey], e.target['proxy'].checked);
            updateYamlDocument(tmpYaml);
        }
    }

    function handleAddClick(e: React.MouseEvent<HTMLElement, MouseEvent>, parentKeys: string[]) {
        e.preventDefault();
        if (e.target) {
            const tmpYaml = yaml.clone();
            const newPair = tmpYaml.createPair('', '');
            tmpYaml.addIn(parentKeys, newPair);
            updateYamlDocument(tmpYaml);
        }
    }

    function handleDeleteClick(
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        variableKey: string,
        parentKeys: string[]
    ) {
        e.preventDefault();
        if (e.target) {
            const tmpYaml = yaml.clone();
            tmpYaml.deleteIn([...parentKeys, variableKey]);
            updateYamlDocument(tmpYaml);
        }
    }

    function updateYamlDocument(newYamlDocument: any) {
        setYaml(newYamlDocument);
        const document = newYamlDocument.toString();
        if (!props.vscodeApi) {
            localStorage.setItem('config', document);
            return;
        }
        props.vscodeApi?.postMessage({
            type: 'updateDocument',
            text: document
        });
    }

    function resolveParentNode(yaml: any, parentKeys: string[]) {
        parentKeys.forEach((key) => (yaml = yaml[key]));
        return yaml;
    }

    function renderAddButton(parentKeys: string[]) {
        return (
            <VSCodeButton
                appearance='icon'
                aria-label='Add'
                onClick={(e) => handleAddClick(e, parentKeys)}>
                <span className='codicon codicon-add' />
            </VSCodeButton>
        );
    }

    function renderAddParentNodeButton(parentKeys: string[]) {
        return (
            <VSCodeButton
                appearance='icon'
                aria-label='Add Parent Node'
                onClick={(e) => handleAddParentNodeClick(e, parentKeys)}>
                <span className='codicon codicon-type-hierarchy-sub' />
            </VSCodeButton>
        );
    }

    function renderDeleteButton(key: string, parentKeys: string[]) {
        return (
            <VSCodeButton
                appearance='icon'
                aria-label='Delete'
                onClick={(e) => handleDeleteClick(e, key, parentKeys)}>
                <span className='codicon codicon-trash' />
            </VSCodeButton>
        );
    }
}
