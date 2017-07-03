import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'terra-popup';
import 'terra-base/lib/baseStyles';
import MenuItem from './MenuItem';
import MenuItemGroup from './MenuItemGroup';
import SubMenu from './_SubMenu';
import MenuNavStack from './_MenuNavStack';
import './Menu.scss';

const propTypes = {
  /**
   * List of Menu.Items/Menu.ItemGroups to be displayed as content within the Menu.
   */
  children: PropTypes.node.isRequired,
  /**
   * Callback function indicating a close condition was met, should be combined with isOpen for state management.
   */
  onRequestClose: PropTypes.func.isRequired,
  /**
   * Target element for the menu to anchor to.
   */
  targetRef: PropTypes.func.isRequired,
  /**
   * Bounding container for the menu, will use window if no value provided.
   */
  boundingRef: PropTypes.func,
  /**
   * CSS classnames that are append to the arrow.
   */
  classNameArrow: PropTypes.string,
  /**
   * CSS classnames that are append to the menu content inner.
   */
  classNameContent: PropTypes.string,
  /**
   * CSS classnames that are append to the overlay.
   */
  classNameOverlay: PropTypes.string,
  /**
   * Should the menu be presented as open.
   */
  isOpen: PropTypes.bool,
};

const defaultProps = {
  children: [],
  isOpen: false,
};

class Menu extends React.Component {
  static getPopupHeight(contentHeight) {
    if (contentHeight >= 900) {
      return 900;
    } else if (contentHeight >= 675) {
      return 675;
    } else if (contentHeight >= 450) {
      return 450;
    }

    return 225;
  }

  static getBoundsProps(boundingFrame, popupHeight) {
    const boundsProps = {
      contentWidth: 160,
      contentHeight: popupHeight,
    };

    if (boundingFrame) {
      boundsProps.contentHeightMax = boundingFrame.clientHeight;
      boundsProps.contentWidthMax = boundingFrame.clientWidth;
    } else {
      boundsProps.contentHeightMax = window.innerHeight;
      boundsProps.contentWidthMax = window.innerWidth;
    }

    return boundsProps;
  }

  constructor(props) {
    super(props);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.wrapOnRequestClose = this.wrapOnRequestClose.bind(this);
    this.handleItemSelection = this.handleItemSelection.bind(this);
    this.wrapOnClick = this.wrapOnClick.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.getContentHeight = this.getContentHeight.bind(this);
    this.push = this.push.bind(this);
    this.pop = this.pop.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const items = this.props.children.map((item) => {
      if (item.props.subMenuItems && item.props.subMenuItems.length > 0) {
        return React.cloneElement(item, { onClick: this.wrapOnClick(item) });
      }

      return item;
    });

    const initialMenu = (
      <SubMenu key="MenuPage-0" >
        {items}
      </SubMenu>
    );

    return {
      stack: [initialMenu],
    };
  }

  getContentHeight() {
    let contentCount = 0;

    for (let i = 0; i < this.props.children.length; i += 1) {
      const child = this.props.children[i];
      if (child.props.children && child.props.children.length > 0) {
        contentCount += child.props.children.length;
      } else {
        contentCount += 1;
      }
    }

    return contentCount * 34;
  }


  handleRequestClose() {
    this.setState(this.getInitialState());
  }

  handleItemSelection(event, item) {
    const index = this.state.stack.length;
    this.push(<SubMenu key={`MenuPage-${index}`} title={item.props.text}>{item.props.subMenuItems}</SubMenu>);
  }

  wrapOnClick(item) {
    const onClick = item.props.onClick;
    return (event) => {
      this.handleItemSelection(event, item);

      if (onClick) {
        onClick(event);
      }
    };
  }

  wrapOnRequestClose() {
    const onRequestClose = this.props.onRequestClose;

    return (event) => {
      this.handleRequestClose();
      onRequestClose(event);
    };
  }

  pop() {
    this.setState((prevState) => {
      prevState.stack.pop();
      return { stack: prevState.stack };
    });
  }

  push(content) {
    this.setState((prevState) => {
      prevState.stack.push(content);
      return { stack: prevState.stack };
    });
  }

  render() {
    const {
      boundingRef,
      classNameArrow,
      classNameContent,
      classNameOverlay,
      onRequestClose,
      isOpen,
      children,
      targetRef,
      ...customProps
    } = this.props;
    const attributes = Object.assign({}, customProps);
    const boundingFrame = this.props.boundingRef ? this.props.boundingRef() : undefined;

    const contentHeight = this.getContentHeight();
    const popupHeight = Menu.getPopupHeight(contentHeight);
    const boundsProps = Menu.getBoundsProps(boundingFrame, popupHeight);
    const popupDimensions = `${popupHeight / 9}x 10x`;

    return (
      <Popup
        {...attributes}
        boundingRef={boundingRef}
        isArrowDisplayed
        contentAttachment="bottom center"
        contentDimensions={popupDimensions}
        classNameArrow={classNameArrow}
        classNameContent={classNameContent}
        classNameOverlay={classNameOverlay}
        isOpen={isOpen}
        onRequestClose={this.wrapOnRequestClose()}
        targetRef={targetRef}
        isHeaderDisabled
      >
        <MenuNavStack {...boundsProps} items={this.state.stack} onRequestClose={this.wrapOnRequestClose()} onRequestBack={this.pop} />
      </Popup>
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;
Menu.Item = MenuItem;
Menu.ItemGroup = MenuItemGroup;

export default Menu;
