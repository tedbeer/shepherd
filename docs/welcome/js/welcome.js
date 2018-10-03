(function() {

  function init() {
    const shepherd = setupShepherd();

    setTimeout(() => {
      shepherd.start();
    }, 250);
  }

  function setupShepherd () {
    const shepherd = new Shepherd.Tour({
      defaultStepOptions: {
        showCancelLink: true
      },
    });

    shepherd.addStep('welcome', {
      text: ['Shepherd is a javascript library for guiding users through your app. It uses <a href="https://popper.js.org/">Popper.js</a>, another open source library, to position all of its steps.', 'Popper makes sure your steps never end up off screen or cropped by an overflow. Try resizing your browser to see what we mean.'],
      attachTo: '.hero-welcome bottom',
      classes: 'shepherd shepherd-welcome',
      buttons: [
        {
          action: shepherd.cancel,
          classes: 'shepherd-button-secondary',
          text: 'Exit'
        }, {
          action: shepherd.next,
          text: 'Next'
        }
      ],
    });
    shepherd.addStep('including', {
      title: 'Including',
      text: 'Including Shepherd is easy! Just include popper.js, shepherd.js, and a Shepherd theme file.',
      attachTo: '.hero-including bottom',
      buttons: [
        {
          action: shepherd.back,
          classes: 'shepherd-button-secondary',
          text: 'Back'
        }, {
          action: shepherd.next,
          text: 'Next'
        }
      ]
    });
    shepherd.addStep('creating', {
      title: 'Creating a Shepherd Tour',
      text: `Creating a Shepherd tour is easy. too!\
      Just create a \`Tour\` instance, and add as many steps as you want.`,
      attachTo: '.hero-example bottom',
      buttons: [
        {
          action: shepherd.back,
          classes: 'shepherd-button-secondary',
          text: 'Back'
        }, {
          action: shepherd.next,
          text: 'Next'
        }
      ]
    });
    shepherd.addStep('attaching', {
      title: 'Attaching to Elements',
      text: `Your tour steps can target and attach to elements in DOM (like this step).`,
      attachTo: '.hero-example bottom',
      buttons: [
        {
          action: shepherd.back,
          classes: 'shepherd-button-secondary',
          text: 'Back'
        }, {
          action: shepherd.next,
          text: 'Next'
        }
      ]
    });
    shepherd.addStep('centered-example', {
      title: 'Centered Shepherd Element',
      text: `But attachment is totally optional! \
      Without a target, a tour step will create an element that's centered within the view. \
      Check out the <a href="https://shipshapecode.github.io/shepherd/">documentation</a> to learn more.`,
      buttons: [
        {
          action: shepherd.back,
          classes: 'shepherd-button-secondary',
          text: 'Back'
        }, {
          action: shepherd.next,
          text: 'Next'
        }
      ]
    });
    shepherd.addStep('followup', {
      title: 'Learn more',
      text: 'Star Shepherd on Github so you remember it for your next project',
      attachTo: '.hero-followup left',
      buttons: [
        {
          action: shepherd.back,
          classes: 'shepherd-button-secondary',
          text: 'Back'
        }, {
          action: shepherd.next,
          text: 'Done'
        }
      ]
    });

    return shepherd;
  }

  function ready() {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
      init();
    } else {
      document.addEventListener('DOMContentLoaded', init);
    }
  }

  ready();

}).call(this);
