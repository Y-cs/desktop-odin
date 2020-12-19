import React, { Component } from 'react';
import Window from '@/component/application/Window';
import TaskMenu from '@/component/task-menu/TaskMenu';
import { Apps } from '@/constant/DesktopConstant';


export default class Desktop extends Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Window />
        <TaskMenu apps={Apps} />
      </div>
    );
  }

}
