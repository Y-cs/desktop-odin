import React, { Component, useState } from 'react';
import Style from './TaskMenu.less';
import { Apps, taskBarHeight, windows } from '@/constant/DesktopConstant';
import Window from '@/component/application/Window';

interface TaskMenuProps {
  top: number,
  height: number,
  apps: Map<string, Window>,
}

export default class TaskMenu extends React.Component<any, TaskMenuProps> {

  constructor(props: any) {
    super(props);
    this.state = {
      top: windows.height,
      height: taskBarHeight,
      apps: this.props.apps,
    };
    addEventListener('resize', this.resizeFunc);
  }

  resizeFunc = () => {
    this.setState({
      top: windows.height,
    });
  };

  taskOnMouseDown = (component: Window, e: any) => {
    component.toSmall(e);
  };

  render() {
    const apps = this.state.apps;
    const tasks: Array<any> = Array();
    apps.forEach((value, key) => {
      tasks.push((<div key={key} className={Style.task} onMouseDown={(e: any) => this.taskOnMouseDown(value, e)}>
        {key}
      </div>));
    });
    return <div className={Style.taskMenu} style={{ top: this.state.top, height: this.state.height }}>
      {tasks.map((value => {
        return value;
      }))}
    </div>;
  }

};
