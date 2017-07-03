import React from 'react';
import Menu from '../../../lib/Menu';

class Deminsions25xMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.setButtonNode = this.setButtonNode.bind(this);
    this.getButtonNode = this.getButtonNode.bind(this);
    this.state = { open: false };
  }

  setButtonNode(node) {
    this.buttonNode = node;
  }

  getButtonNode() {
    return this.buttonNode;
  }

  handleButtonClick() {
    this.setState({ open: true });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <div>
          This menu should have a calculated height of 25x.
        </div>
        <Menu
          isOpen={this.state.open}
          targetRef={this.getButtonNode}
          onRequestClose={this.handleRequestClose}
        >
          <Menu.Item text="Default 1" key="1" />
          <Menu.Item text="Default 2" key="2" />
          <Menu.Item text="Default 3" key="3" />
          <Menu.Item text="Default 4" key="4" />
          <Menu.Item text="Default 5" key="5" />
          <Menu.ItemGroup isSelectable onChange={this.handleRequestClose} key="6">
            <Menu.Item text="Default 61" key="61" />
            <Menu.Item text="Default 62" key="62" />
            <Menu.Item text="Default 63" key="63" />
          </Menu.ItemGroup>
          <Menu.Item text="Default 7" key="7" />
          <Menu.Item text="Default 8" key="8" />
          <Menu.Item text="Default 9" key="9" />
          <Menu.Item text="Default 10" key="10" />
          <Menu.Item text="Default 11" key="11" />
        </Menu>
        <button id="default-button" onClick={this.handleButtonClick} ref={this.setButtonNode}>
          Default Menu
        </button>
      </div>
    );
  }
}

export default Deminsions25xMenu;
