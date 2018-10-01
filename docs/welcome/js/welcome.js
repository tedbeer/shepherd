(function() {
  var init, setupShepherd;

  init = function() {
    return setupShepherd();
  };

  setupShepherd = function() {
    var shepherd;
    shepherd = new Shepherd.Tour({
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
      popperOptions: {
        modifiers: {
          flip: {
            enabled: false,
          },
        },
      },
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
    shepherd.addStep('example', {
      title: 'Example Shepherd',
      text: 'Creating a Shepherd is easy too! Just create Shepherd and add as many steps as you want. Check out the <a href="https://shipshapecode.github.io/shepherd/">documentation</a> to learn more.',
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
    return shepherd.start();
  };

  init();

}).call(this);
