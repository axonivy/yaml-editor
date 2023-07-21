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

export default function YAMLVariablesTable(props: YAMLVariablesTableProps) {
    const [yaml, setYaml] = useState(YAML.parseDocument(''));

    useEffect(() => {
        if (!props.vscodeApi) {
            const config = localStorage.getItem('config');
            if (config) {
                const parsedYaml = YAML.parseDocument(config);
                setYaml(parsedYaml);
            }
            return;
        }
        window.addEventListener('message', (event) => {
            const message = event.data;
            let text = message.text;
            if (message.type === 'update' && text) {
                const parsedYaml = YAML.parseDocument(text);
                setYaml(parsedYaml);
            }
        });
    }, [props]);

    return (
        <main id='webview-body'>
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
                {value
                    ? Object.entries(value).map(([childKey, childValue]) =>
                          renderDataGrid(childKey, childValue, [...parentKeys, key])
                      )
                    : null}
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
            const tmpYaml = yaml.clone();
            tmpYaml.setIn([...parentKeys, tmpYaml.createNode('')], tmpYaml.createNode({}));
            updateYamlDocument(tmpYaml);
        }
    }

    function handleVariableKeyChange(e: Event, variableKey: string, parentKeys: string[]) {
        e.preventDefault();
        if (e.target) {
            const newKey = e.target['value'];
            const tmpYaml = yaml.clone();
            const parentNode = tmpYaml.getIn(parentKeys, true) as any;
            if (parentNode.has(newKey)) {
                updateYamlDocument(tmpYaml);
                return;
            }
            YAML.visit(parentNode, {
                Pair(_, pair) {
                    const key = pair.key as any;
                    if (key.value === variableKey) {
                        key.value = newKey;
                        key.soruce = newKey;
                        key.type = YAML.Scalar.PLAIN;
                    }
                }
            });
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
            tmpYaml.setIn([...parentKeys, variableKey], tmpYaml.createNode(newValue));
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
            tmpYaml.setIn(
                [...parentKeys, variableKey],
                tmpYaml.createNode(e.target['proxy'].checked)
            );
            updateYamlDocument(tmpYaml);
        }
    }

    function handleAddClick(e: React.MouseEvent<HTMLElement, MouseEvent>, parentKeys: string[]) {
        e.preventDefault();
        if (e.target) {
            const tmpYaml = yaml.clone();
            const parentValue = tmpYaml.getIn(parentKeys);
            if (!parentValue) {
                tmpYaml.setIn(parentKeys, tmpYaml.createNode({}));
            }
            tmpYaml.setIn([...parentKeys, tmpYaml.createNode('')], tmpYaml.createNode(''));
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
        const document = (newYamlDocument as YAML.Document).toString({
            collectionStyle: 'block',
            defaultStringType: 'PLAIN'
        });

        if (!props.vscodeApi) {
            localStorage.setItem('config', document);
            return;
        }
        props.vscodeApi?.postMessage({
            type: 'updateDocument',
            text: document
        });
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
