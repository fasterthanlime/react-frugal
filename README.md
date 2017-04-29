# React Wastage Monitor

How pure are your components, really? Just throwing on shallowCompare doesn't
actually get you performant components, you depend on the parents just as much,
only sending down the props you actually need, ensuring they cache object
literals rather than rebuild inside render functions, and it's so easy to make
a critical performance mistake and not notice it.

If we're to rely on Redux managing the state for our entire app, it's imperative
that we can count on our components to only render when we need them to. **React
Wastage Monitor** is a little tool that attaches to React and ensures your
components are being all they can be, never wasting computation on renders that
aren't required.

## Installation

```
npm install react-wastage-monitor
```

## Usage

React Wastage Monitor attaches to React by importing it, making a component, and
then using that opportunity to monkey patch React's CompositeComponent. This
allows us to hook into every component as it goes through the Component
Lifecycle to verify your prop and state usage. All you need to do is run this
code early in your codebase before mounting the rest of the app:

```
import ReactWastageMonitor from 'react-wastage-monitor'
ReactWastageMonitor()
```

Ideally you should always run this code in development so you're constantly kept
up to date on poorly performing components. Have a strategy to strip this code
in production such as using environment variables and a minifier:

```
if (process.env.NODE_ENV !== 'production') {
  ReactWastageMonitor()
}
```


*While care has been taken to avoid breaking the internals of React, this kind
of monkey patching does come with risks especially as new versions are released.
Please let us know if React Wastage Monitor breaks React for you. You should not
use React Wastage Monitor in production.*

## What does it check?

### Components that are not pure, and don't implement shouldComponentUpdate
Any components that are impure, ie they don't inherit from PureComponent and
they don't implement shouldComponentUpdate, will always update regardless of the
equality of their props. This should be avoided wherever possible and will be
brought to your attention when they rerender:

```
<Component> is impure and will ALWAYS update when a component above it does
```

### Components that return true on shouldComponentUpdate even when their props/state are deeply equal
Usually this is a side effect of reusing object literal inside the component
parent's render function. Because it's a new object every time, shallow compare
will incorrectly believe it has new props, wasting render time. Components that
render whilst having deeply equal changes will be brought to your attention
along with what deeply equal yet referentially unequal values were found:

```
<Component> updated when it shouldn't need to
  ref inequality:propName <fromValue> -> <toValue>
```

### Components where their props genuinely change yet the HTML didn't
This is usually the result of passing down more props than you need to, or
functions that are continually recreated anonymously or through binding. The
monitor will compare a component's HTML before and after an update, and if it's
identical, will check to see what props/state have changed to trigger this
re-render.

```
<Component> props/state changed and updated but the HTML didn't
  changed:onClick <fromValue> -> <toValue>
```

## I think it should test...
Sure thing, let us know in the issues and we'll see if it makes sense and is
doable.

