import React, { Component, createRef } from 'react';
import Style from './Windows.less';
import { Apps, windows } from '@/constant/DesktopConstant';
import set = Reflect.set;

interface AppState {
  name?: string
  width: any
  height: any
  left: any
  top: any
  showMax: boolean
  isShow: boolean
}

const [minW, minH]: number[] = [200, 100];
const resizeDirection = ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'];


export default class extends Component<any, AppState> {
  private isMove: boolean;
  private resize: boolean;
  private dx!: number;
  private dy!: number;
  private afterState!: AppState;
  private bodyW!: number;
  private bodyH!: number;

  constructor(props: any) {
    super(props);
    const { width, height } = windows;
    this.state = {
      name: props.name ? props.name : 'Window',
      width: width / 2,
      height: height / 2,
      left: width / 4,
      top: height / 4,
      showMax: true,
      isShow: true,
    };
    Apps.set('windows', this);
    this.isMove = false;
    this.resize = false;
    window.addEventListener('resize', this.resizeFunc);
  }


  resizeDown = (line: string, e: any) => {
    e.stopPropagation;
    this.resize = true;
    //绑定事件
    window.onmousemove = (e: any) => this.resizeWindow(line, e);
    window.onmouseup = this.mouseUp;
    this.afterState = this.state;
  };

  resizeWindow = (index: string, e: any) => {
    if (this.resize && index) {
      let x = e.clientX - this.afterState.left;
      let y = e.clientY - this.afterState.top;
      const { width, height } = windows;
      let fn: { [key: string]: any } = {
        r: () => {
          this.setState({
            width: Math.min(Math.max(x, minW), width - this.afterState.left),
          });
        },
        b: () => {
          this.setState({
            height: Math.min(Math.max(y, minH), height - this.afterState.top),
          });
        },
        l: () => {
          this.setState({
            width: Math.min(Math.max(this.afterState.width - x, minW), this.afterState.left + this.afterState.width),
            left: Math.max(Math.min(this.afterState.left + x, this.afterState.left + this.afterState.width - minW), 0),
          });
        },
        t: () => {
          this.setState({
            height: Math.min(Math.max(this.afterState.height - y, minH), this.afterState.top + this.afterState.height),
            top: Math.max(Math.min(this.afterState.top + y, this.afterState.top + this.afterState.height - minH), 0),
          });
        },
      };
      this.setState({
        showMax: true,
      });
      index.split('').forEach((value) => {
        if (fn[value]) {
          fn[value](e);
        }
      });
    }
  };

  titleMouseDown = (e: any) => {
    e.stopPropagation;
    //开启移动
    this.isMove = true;
    //绑定事件
    window.onmousemove = this.mouseMove;
    window.onmouseup = this.mouseUp;
    //获取整体大小
    const { width, height } = windows;
    this.bodyW = width - this.state.width;
    this.bodyH = height - this.state.height;
    //计算差值
    let position = this.getPosition(e);
    this.dx = position.diffX;
    this.dy = position.diffY;
  };
  mouseMove = (e: any) => {
    this.isMove && this.move(e);
  };
  move = (e: any) => {
    if (this.dx && this.dy) {
      let x = e.clientX - this.dx;
      let y = e.clientY - this.dy;
      x = Math.max(0, Math.min(x, this.bodyW));
      y = Math.max(0, Math.min(y, this.bodyH));
      this.setState({
        left: x,
        top: y,
      });
    }
  };
  mouseUp = (e: any) => {
    this.isMove = false;
    this.resize = false;
    window.onmousemove = null;
    window.onmouseup = null;
  };

  getPosition = (e: any) => {
    let target = e.target;
    //当前组件的坐标
    let x = target.getBoundingClientRect().left;
    let y = target.getBoundingClientRect().top;
    //当前鼠标的坐标
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    //鼠标坐标和组件左上角坐标差
    let diffX = mouseX - x;
    let diffY = mouseY - y;
    return { x, y, mouseX, mouseY, diffX, diffY };
  };

  shouMaxOnClick = (e: any) => {
    e.stopPropagation;
    this.setState({
      showMax: !this.state.showMax,
    });
    if (this.state.showMax) {
      const { width, height } = windows;
      this.afterState = this.state;
      this.setState({
        width: width,
        height: height,
        top: 0,
        left: 0,
      });
    } else {
      this.setState(this.afterState);
    }
  };

  toSmall = (e: any) => {
    this.setState({
      isShow: !this.state.isShow,
    });
  };

  close = (e: any) => {
    Apps.delete('windows');
  };

  resizeFunc = (e: any) => {
    const { width, height } = windows;
    if (this.state.width > width) {
      this.setState({
        width: width,
        showMax: true,
      });
    }
    if (this.state.width + this.state.left > width) {
      this.setState({
        left: width - this.state.width,
        showMax: true,
      });
    }
    if (this.state.height > height) {
      this.setState({
        height: height,
        showMax: true,
      });
    }
    if (this.state.height + this.state.top > height) {
      this.setState({
        top: height - this.state.height,
        showMax: true,
      });
    }
  };

  render() {
    return (
      <div
        style={{
          width: this.state.width,
          height: this.state.height,
          top: this.state.top,
          left: this.state.left,
          display: this.state.isShow ? 'block' : 'none',
        }}
        className={Style.windows}>
        <div style={{ width: this.state.width }}
             className={Style.topTitle} onMouseDown={this.titleMouseDown}>
          {this.state.name}
          <div>
            <span className={Style.c1} onMouseDown={this.toSmall}>
              <svg className='icon' viewBox='0 0 1024 1024'><path d='M64 576h896V448H64z'
                                                                  fill='#e6e6e6'
                                                                  p-id='4418'></path></svg>
            </span>
            <span className={Style.c2} style={{ display: this.state.showMax ? 'none' : 'block' }}
                  onMouseDown={this.shouMaxOnClick}>
              <svg className='icon' viewBox='0 0 1024 1024'><path
                d='M638.4 305.28L879.616 64 960 144.384 718.464 385.92l132.16 133.248H512V177.792L638.4 305.28zM385.152 722.112L146.56 960.64l-80.384-80.384 238.272-238.272L173.376 512H512v336l-126.848-125.888z'
                fill='#e6e6e6' p-id='4249'></path></svg>
            </span>
            <span className={Style.c2} style={{ display: this.state.showMax ? 'block' : 'none' }}
                  onMouseDown={this.shouMaxOnClick}>
              <svg className='icon' viewBox='0 0 1024 1024' p-id='3842'><path
                d='M833.6 277.952l-241.216 241.28L512 438.72l241.536-241.536L621.44 64H960v341.376l-126.4-127.36zM190.848 749.888L429.44 511.36l80.384 80.384-238.272 238.272L402.624 960H64V624l126.848 125.888z'
                fill='#e6e6e6' p-id='3843'></path></svg>
            </span>
            <span className={Style.c3} onMouseDown={this.close}>
              <svg className='icon' viewBox='0 0 1024 1024' p-id='4043'><path
                d='M960 154.24L869.76 64 512 421.76 154.24 64 64 154.24 421.76 512 64 869.76 154.24 960 512 602.24 869.76 960 960 869.76 602.24 512z'
                fill='#e6e6e6' p-id='4044'></path></svg>
            </span>
          </div>
        </div>
        {this.props.children}
        {
          resizeDirection.map((value, index) => {
              return <div key={'resize' + index} className={Style['resize-handle-' + value]}
                          onMouseDown={(e: any) => this.resizeDown(value, e)} />;
            },
          )
        }
      </div>
    )
      ;
  }
}
