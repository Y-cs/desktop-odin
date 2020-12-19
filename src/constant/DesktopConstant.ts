import React, { Component } from 'react';
import Window from '@/component/application/Window';

export const taskBarHeight: number = 40;

interface windowSize {
  width: number;
  height: number
}

const getSize = (): windowSize => {
  const { clientWidth, clientHeight } = document.body;
  return {
    width: clientWidth,
    height: clientHeight - taskBarHeight,
  };
};
export let windows: windowSize = getSize();

window.addEventListener('resize', () => {
  windows = getSize();
});

export const Apps = new Map<string, Window>();


