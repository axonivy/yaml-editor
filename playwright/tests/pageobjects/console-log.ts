import type { Page } from '@playwright/test';

export const consoleLog = async (page: Page) => {
  return new Promise(result => {
    page.on('console', msg => {
      if (msg.type() === 'log') {
        result(msg.text());
      }
    });
  });
};
