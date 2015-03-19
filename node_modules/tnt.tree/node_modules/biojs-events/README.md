
event system
------------------

This is a convenience wrapper for the [Event system](https://github.com/biojs/biojs2/wiki/Event-systems).

You can choose any library that supports the choosen syntax.

This wrapper here is for [`backbone-events-standalone`](https://www.npmjs.org/package/backbone-events-standalone) and thus the Backbone event system.


How to use
----------

### 1. install

```
npm install biojs-events --save
```

### 2. Mix the events capability with your object 

After the code of your BioJS component add the events capability by mixing you component object with the events:

```
require('biojs-events').mixin(my_component);
```

### 3. Trigger events

Now in your code you can use the events methods (trigger, off,on,once):

```
self.trigger('onSomethingChanged', {
 data : "some data to include in your event"
});
```
