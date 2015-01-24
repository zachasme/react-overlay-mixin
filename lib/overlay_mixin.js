/**
 * A Tether.js mixin for React components
 *
 * An *overlay* is another layer on top of the react app
 *
 * Modal: An overlay that prevents usage of the main element
 * Dropdown: An overlay tethered to the initiating button
 * Popover: An overlay tethered to
 *
 * options:
 *  - tethered? (attach to element)
 *  - modal? (block interaction with main view)
 *  - close on outside click?
 */

import React from 'react';
import invariant from 'react/lib/invariant';

import Tether from 'tether/tether.js';

//------------------------------------------------------------------------------

export default {

  getInitialState() {
    // display overlay by default, override in component as needed
    return {
      overlayIsVisible: true,
    };
  },

  componentDidMount() {
    // Appending to the body is easier than managing the z-index of everything
    // on the page. It's also better for accessibility and makes stacking a snap
    // (since components will stack in mount order).
    this._overlayElement = document.createElement( 'div' );
    this._overlayElement.style['position'] = 'absolute';
    this._overlayElement.style['zIndex'] = 999999;

    document.body.appendChild( this._overlayElement );

    document.addEventListener('click', event => {
      let clickedOverlay = this._overlayElement.contains( event.target );
      let clickedComponent = this.getDOMNode().contains( event.target );

      if ( this.state.overlayIsVisible && !clickedOverlay ) {
        this.setState({ overlayIsVisible: false });
      }
    });

    renderOverlay.call(this);
  },

  componentDidUpdate() {
    renderOverlay.call(this);
  },

  componentWillUnmount() {
    unrenderOverlay.call(this);
  },

};


// TODO: Untether on hiden
function renderOverlay() {
  // By calling this method in componentDidMount() and componentDidUpdate(),
  // you're effectively creating a "wormhole" that funnels React's
  // hierarchical updates through to a DOM node on an entirely different part
  // of the page.
  let overlay = React.createElement( 'div' );

  if ( this.state.overlayIsVisible ) {
    overlay = this.renderOverlay();
  }

  React.render( overlay, this._overlayElement );

}

function unrenderOverlay() {
  let wasOverlayMounted = React.unmountComponentAtNode( this._overlayElement );
  if ( !wasOverlayMounted ) {
    throw "Component was not mounted during unrender";
  }

  document.body.removeChild( this._overlayElement );
}
