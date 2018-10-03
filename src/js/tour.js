import { isFunction, isNumber, isString, isUndefined } from 'lodash';
import { Evented } from './evented.js';
import { Step } from './step.js';
import { bindMethods } from './bind.js';
import tippy from 'tippy.js';
import { defaults as tooltipDefaults } from './utils/tooltip-defaults';

const Shepherd = new Evented();

/**
 * Class representing the site tour
 * @extends {Evented}
 */
export class Tour extends Evented {
  /**
   *
   * @param {Object} options The options for the tour
   * @param {Object} options.defaultStepOptions Default options for Steps created through `addStep`
   * @param {Step[]} options.steps An array of Step instances to initialize the tour with
   * @returns {Tour}
   */
  constructor(options = {}) {
    super(options);
    bindMethods.call(this, [
      'back',
      'cancel',
      'complete',
      'next'
    ]);
    this.options = options;
    this.steps = this.options.steps || [];

    // Pass these events onto the global Shepherd object
    const events = ['active', 'cancel', 'complete', 'inactive', 'show', 'start'];
    events.map((event) => {
      ((e) => {
        this.on(e, (opts) => {
          opts = opts || {};
          opts.tour = this;
          Shepherd.trigger(e, opts);
        });
      })(event);
    });

    this._setTooltipDefaults();

    return this;
  }

  /**
   * Adds a new step to the tour
   * @param {Object|Number|Step|String} arg1
   * When arg2 is defined, arg1 can either be a string or number, to use for the `id` for the step
   * When arg2 is undefined, arg1 is either an object containing step options or a Step instance
   * @param {Object|Step} arg2 An object containing step options or a Step instance
   * @return {Step} The newly added step
   */
  addStep(arg1, arg2) {
    let name, stepOptions;

    // If we just have one argument, we can assume it is an object of step options, with an id
    if (isUndefined(arg2)) {
      stepOptions = arg1;
    } else {
      name = arg1;
      stepOptions = arg2;
    }

    let step;

    if (stepOptions instanceof Step) {
      step = stepOptions;
      step.tour = this;
    }

    step = this.setupStep(stepOptions, name);

    this.steps.push(step);
    return step;
  }

  /**
   * Go to the previous step in the tour
   */
  back() {
    const index = this.steps.indexOf(this.currentStep);
    this.show(index - 1, false);
  }

  /**
   * Calls done() triggering the 'cancel' event
   * If `confirmCancel` is true, will show a window.confirm before cancelling
   */
  cancel() {
    if (this.options.confirmCancel) {
      const cancelMessage = this.options.confirmCancelMessage || 'Are you sure you want to stop the tour?';
      const stopTour = window.confirm(cancelMessage);
      if (stopTour) {
        this.done('cancel');
      }
    } else {
      this.done('cancel');
    }
  }

  /**
   * Calls done() triggering the `complete` event
   */
  complete() {
    this.done('complete');
  }

  /**
   * Called whenever the tour is cancelled or completed, basically anytime we exit the tour
   * @param {String} event The event name to trigger
   */
  done(event) {
    if (this.currentStep) {
      this.currentStep.hide();
    }

    this.trigger(event);

    if (Shepherd.activeTour) {
      Shepherd.activeTour.steps.forEach((step) => {
        step.destroy();
      });
    }

    Shepherd.activeTour = null;
    document.body.classList.remove('shepherd-active');
    this.trigger('inactive', { tour: this });
  }

  /**
   * Gets the step from a given id
   * @param {Number|String} id The id of the step to retrieve
   * @return {Step} The step corresponding to the `id`
   */
  getById(id) {
    return this.steps.find((step) => {
      return step.id === id;
    });
  }

  /**
   * Gets the current step
   * @returns {Step|null}
   */
  getCurrentStep() {
    return this.currentStep;
  }

  /**
   * Go to the next step in the tour
   * If we are at the end, call `complete`
   */
  next() {
    const index = this.steps.indexOf(this.currentStep);

    if (index === this.steps.length - 1) {
      this.complete();
    } else {
      this.show(index + 1, true);
    }
  }

  /**
   * Removes the step from the tour
   * @param {String} name The id for the step to remove
   */
  removeStep(name) {
    const current = this.getCurrentStep();

    // Find the step, destroy it and remove it from this.steps
    this.steps.some((step, i) => {
      if (step.id === name) {
        if (step.isOpen()) {
          step.hide();
        }

        step.destroy();
        this.steps.splice(i, 1);

        return true;
      }
    });

    if (current && current.id === name) {
      this.currentStep = undefined;

      // If we have steps left, show the first one, otherwise just cancel the tour
      this.steps.length ? this.show(0) : this.cancel();
    }
  }

  /**
   * Setup a new step object
   * @param {Object} stepOptions The object describing the options for the step
   * @param {String|Number} name The string or number to use as the `id` for the step
   * @return {Step} The step instance
   */
  setupStep(stepOptions, name) {
    if (isString(name) || isNumber(name)) {
      stepOptions.id = name.toString();
    }

    stepOptions = Object.assign({}, this.options.defaultStepOptions, stepOptions);

    return new Step(this, stepOptions);
  }

  /**
   * Show a specific step in the tour
   * @param {Number|String} key The key to look up the step by
   * @param {Boolean} forward True if we are going forward, false if backward
   */
  show(key = 0, forward = true) {
    debugger;
    this._setupActiveTour();

    const step = isString(key) ? this.getById(key) : this.steps[key];

    if (!step) {
      return;
    }

    const shouldSkipStep = isFunction(step.options.showOn) && !step.options.showOn();
    // If `showOn` returns false, we want to skip the step, otherwise, show the step like normal
    if (shouldSkipStep) {
      this._skipStep(step, forward);
    } else {
      this.trigger('show', {
        step,
        previous: this.currentStep
      });

      this.currentStep = step;
      step.show();
    }
  }

  /**
   * Start the tour
   */
  start() {
    this.trigger('start');

    this.currentStep = null;
    this.next();
  }

  /**
   * If we have a currentStep, the tour is active, so just hide the step and remain active.
   * Otherwise, make the tour active.
   * @private
   */
  _setupActiveTour() {
    if (this.currentStep) {
      this.currentStep.hide();
    } else {
      document.body.classList.add('shepherd-active');
      this.trigger('active', { tour: this });
    }

    Shepherd.activeTour = this;
  }

  /**
   * Called when `showOn` evaluates to false, to skip the step
   * @param {Step} step The step to skip
   * @param {Boolean} forward True if we are going forward, false if backward
   * @private
   */
  _skipStep(step, forward) {
    const index = this.steps.indexOf(step);
    const nextIndex = forward ? index + 1 : index - 1;
    this.show(nextIndex, forward);
  }

  _setTooltipDefaults() {
    if (isUndefined(tippy)) {
      throw new Error('Using the attachment feature of Shepherd requires the Tippy.js library');
    }

    tippy.setDefaults(tooltipDefaults);
  }
}

export { Shepherd };
