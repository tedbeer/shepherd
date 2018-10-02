import { isString, isObjectLike, isUndefined, zipObject } from 'lodash';
import tippy from 'tippy.js';

/**
 * TODO rewrite the way items are being added to use more performant documentFragment code
 * @param html
 * @return {HTMLElement} The element created from the passed HTML string
 */
export function createFromHTML(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.children[0];
}

/**
 * Parse the position object or string to return the attachment and element to attach to
 * @param {Object|String} position Either a string or object denoting the selector and position for attachment
 * @return {Object} The object with `element` and `on` for the step
 */
export function _parseAttachToOpts(opts) {
  if (isObjectLike(opts)) {
    if (opts.hasOwnProperty('element') && opts.hasOwnProperty('on')) {
      return opts;
    }
    return null;
  }

  const positionRe = /^(.+) (top|left|right|bottom|center)$/;
  const matches = positionRe.exec(opts);

  if (!matches) {
    return null;
  }

  return {
    element: matches[1],
    on: matches[2]
  };
}

/**
 * @param obj
 * @param {Array} props
 * @return {*}
 */
export function parseShorthand(obj, props) {
  if (obj === null || isUndefined(obj)) {
    return obj;
  } else if (isObjectLike(obj)) {
    return obj;
  }

  const values = obj.split(' ');
  return zipObject(props, values);
}

/**
 * Determines options for the Tippy.js tooltip and initializes it.
 */
export function setupTooltipElem() {
  debugger;
  if (isUndefined(tippy)) {
    throw new Error('Using the attachment feature of Shepherd requires the Tippy.js library');
  }

  if (this.tooltipElem) {
    this.tooltipElem.destroy();
  }

  const attachToOpts = this.parseAttachTo();

  attachToOpts.positionFixed = false;

  const tippyOptions = _makeTippyOptions.call(this, attachToOpts);

  this.el.classList.add('shepherd-element');

  this.tooltipElem = tippy.one(attachToOpts.element, tippyOptions);

  this.target = attachToOpts.element;
  this.target.classList.add('shepherd-enabled', 'shepherd-target');
}


/**
 * Generates the hash of options that will be passed to `Tippy`.
 *
 * @param {Object} baseAttachToOptions The local `attachTo` options
 * @return {Object} The final tippy options  object
 * @private
 */
function _makeTippyOptions(baseAttachToOptions) {
  if (!baseAttachToOptions.element) {
    return _makeCenteredTippyOptions();
  }

  const resultingTippyOptions = {
    content: this.el,
    ...this.options.tippyOptions
  };

  // Build the proper settings for tippyOptions.popperOptions (https://atomiks.github.io/tippyjs/#popper-options-option)
  const popperOptsToMerge = {
    placement: baseAttachToOptions.on || 'right',
    arrowElement: this.el.querySelector('.popper__arrow'),
    positionFixed: !!(baseAttachToOptions.positionFixed),
  };

  if (this.options.tippyOptions && this.options.tippyOptions.popperOptions) {
    Object.assign(popperOptsToMerge, this.options.tippyOptions.popperOptions);
  }

  resultingTippyOptions.popperOptions = popperOptsToMerge;

  return resultingTippyOptions;
}

// TODO: Implement...
function _makeCenteredTippyOptions() {
  debugger;
  return {
    placement: 'top',
  };
}

// /**
//  * Sets up a popper centered on the screen, when there is no attachTo element
//  * @param {Object} opts The config object
//  * @return {*}
//  * @private
//  */
// function _setupCenteredPopper(opts) {
//   opts.element = document.body;
//   opts.on = 'top';

//   opts.modifiers = Object.assign({
//     computeStyle: {
//       enabled: true,
//       fn(data) {
//         data.styles = Object.assign({}, data.styles, {
//           left: '50%',
//           top: '50%',
//           transform: 'translate(-50%, -50%)'
//         });

//         return data;
//       }
//     }
//   }, opts.modifiers);

//   opts.positionFixed = true;
// }


/**
 * Passes `options.attachTo` to `_parseAttachToOpts` to get the correct `attachTo` format
 * @returns {({} & {element, on}) | ({})}
 * `element` is a qualified HTML Element
 * `on` is a string position value
 */
export function parseAttachTo() {
  const options = _parseAttachToOpts(this.options.attachTo) || {};
  const returnOpts = Object.assign({}, options);

  if (isString(options.element)) {
    // Can't override the element in user opts reference because we can't
    // guarantee that the element will exist in the future.
    try {
      returnOpts.element = document.querySelector(options.element);
    } catch(e) {
      // TODO
    }
    if (!returnOpts.element) {
      console.error(`The element for this Shepherd step was not found ${options.element}`);
    }
  }

  return returnOpts;
}
