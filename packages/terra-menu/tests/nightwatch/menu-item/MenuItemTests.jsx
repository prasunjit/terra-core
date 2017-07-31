/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Link } from 'react-router';

const MenuTests = () => (
  <div>
    <ul>
      <li><Link to="/tests/menu-item-tests/default">Menu.Item - Default</Link></li>
      <li><Link to="/tests/menu-item-tests/wrapped-text">Menu.Item - Long Text that wraps</Link></li>
    </ul>
  </div>
);

export default MenuTests;