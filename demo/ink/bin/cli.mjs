#!/usr/bin/env node
import { render, useInput } from 'ink';
import meow from 'meow';
import meowhelp from 'cli-meow-help';
import meowrev, { meowparse } from 'meow-reverse';
import parse from 'shell-quote/parse.js';
import quote from 'shell-quote/quote.js';
import { createContext } from 'react';
import { useSequential } from 'react-seq';
import { useSequentialRouter } from 'array-router';
import main from "./main.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
const name = `ink-ansi-animation`;
const commands = {
  'show [FILE]': {
    desc: `Show an ANSI animation`
  },
  'loop [FILE]...': {
    desc: `Show files in a loop`
  },
  'list': {
    desc: `List ANSI files in current directory`
  }
};
const flags = {
  modemSpeed: {
    desc: `Emulate modem of specific baudrate`,
    alias: 'm',
    type: 'number',
    default: 56000
  },
  blinking: {
    desc: `Enable blinking text`,
    alias: 'b',
    type: 'boolean'
  },
  scrolling: {
    desc: `Enable scrolling`,
    alias: 's',
    type: 'boolean'
  },
  transparency: {
    desc: `Enable transparency`,
    alias: 't',
    type: 'boolean'
  }
};
const helpText = meowhelp({
  name,
  flags,
  commands
});
const options = {
  importMeta: import.meta,
  flags
};
const {
  input: parts,
  flags: query
} = meow(helpText, options);
function parseURL(_, {
  pathname
}) {
  const argv = parse(pathname);
  const {
    input: parts,
    flags: query
  } = meowparse(argv, options);
  return {
    parts,
    query
  };
}
function createURL(_, {
  parts: input,
  query: flags
}) {
  const argv = meowrev({
    input,
    flags
  }, options);
  const pathname = quote(argv);
  return new URL(`argv:${pathname}`);
}
function applyURL(currentURL) {
  globalThis.location.href = currentURL.href;
}
globalThis.location = createURL(null, {
  parts,
  query
});
const SpecialContext = createContext();
function App() {
  useInput(input => {
    if (input.toLowerCase() === 'q') {
      process.exit(0);
    }
  });
  // use command-line URL
  const override = {
    createURL,
    parseURL,
    applyURL
  };
  const [parts, query, rMethods, {
    createContext,
    createBoundary
  }] = useSequentialRouter(override);
  return createContext(useSequential(sMethods => {
    const methods = {
      ...rMethods,
      ...sMethods
    };
    const {
      fallback,
      wrap,
      trap,
      reject
    } = methods;
    // default fallback (issue #142 in React-seq 0.9.0)
    fallback(null);
    // create error boundary
    wrap(children => createBoundary(children));
    // redirect error from boundary to generator function
    trap('error', err => reject(err));
    // method for managing route
    methods.manageRoute = () => [parts, query];
    return main(methods);
  }, [parts, query, rMethods, createBoundary]));
}
render( /*#__PURE__*/_jsx(App, {}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZW5kZXIiLCJ1c2VJbnB1dCIsIm1lb3ciLCJtZW93aGVscCIsIm1lb3dyZXYiLCJtZW93cGFyc2UiLCJwYXJzZSIsInF1b3RlIiwiY3JlYXRlQ29udGV4dCIsInVzZVNlcXVlbnRpYWwiLCJ1c2VTZXF1ZW50aWFsUm91dGVyIiwibWFpbiIsIm5hbWUiLCJjb21tYW5kcyIsImRlc2MiLCJmbGFncyIsIm1vZGVtU3BlZWQiLCJhbGlhcyIsInR5cGUiLCJkZWZhdWx0IiwiYmxpbmtpbmciLCJzY3JvbGxpbmciLCJ0cmFuc3BhcmVuY3kiLCJoZWxwVGV4dCIsIm9wdGlvbnMiLCJpbXBvcnRNZXRhIiwiaW1wb3J0IiwibWV0YSIsImlucHV0IiwicGFydHMiLCJxdWVyeSIsInBhcnNlVVJMIiwiXyIsInBhdGhuYW1lIiwiYXJndiIsImNyZWF0ZVVSTCIsIlVSTCIsImFwcGx5VVJMIiwiY3VycmVudFVSTCIsImdsb2JhbFRoaXMiLCJsb2NhdGlvbiIsImhyZWYiLCJTcGVjaWFsQ29udGV4dCIsIkFwcCIsInRvTG93ZXJDYXNlIiwicHJvY2VzcyIsImV4aXQiLCJvdmVycmlkZSIsInJNZXRob2RzIiwiY3JlYXRlQm91bmRhcnkiLCJzTWV0aG9kcyIsIm1ldGhvZHMiLCJmYWxsYmFjayIsIndyYXAiLCJ0cmFwIiwicmVqZWN0IiwiY2hpbGRyZW4iLCJlcnIiLCJtYW5hZ2VSb3V0ZSJdLCJzb3VyY2VzIjpbImNsaS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IHsgcmVuZGVyLCB1c2VJbnB1dCB9IGZyb20gJ2luayc7XG5pbXBvcnQgbWVvdyBmcm9tICdtZW93JztcbmltcG9ydCBtZW93aGVscCBmcm9tICdjbGktbWVvdy1oZWxwJztcbmltcG9ydCBtZW93cmV2LCB7IG1lb3dwYXJzZSB9IGZyb20gJ21lb3ctcmV2ZXJzZSc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnc2hlbGwtcXVvdGUvcGFyc2UuanMnO1xuaW1wb3J0IHF1b3RlIGZyb20gJ3NoZWxsLXF1b3RlL3F1b3RlLmpzJztcbmltcG9ydCB7IGNyZWF0ZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VTZXF1ZW50aWFsIH0gZnJvbSAncmVhY3Qtc2VxJztcbmltcG9ydCB7IHVzZVNlcXVlbnRpYWxSb3V0ZXIgfSBmcm9tICdhcnJheS1yb3V0ZXInO1xuaW1wb3J0IG1haW4gZnJvbSAnLi9tYWluLmpzeCc7XG5cbmNvbnN0IG5hbWUgPSBgaW5rLWFuc2ktYW5pbWF0aW9uYDtcbmNvbnN0IGNvbW1hbmRzID0ge1xuICAnc2hvdyBbRklMRV0nOiB7IGRlc2M6IGBTaG93IGFuIEFOU0kgYW5pbWF0aW9uYCB9LFxuICAnbG9vcCBbRklMRV0uLi4nOiB7IGRlc2M6IGBTaG93IGZpbGVzIGluIGEgbG9vcGAgfSxcblx0J2xpc3QnOiB7IGRlc2M6IGBMaXN0IEFOU0kgZmlsZXMgaW4gY3VycmVudCBkaXJlY3RvcnlgIH0sXG59O1xuY29uc3QgZmxhZ3MgPSB7XG4gIG1vZGVtU3BlZWQ6IHtcbiAgICBkZXNjOiBgRW11bGF0ZSBtb2RlbSBvZiBzcGVjaWZpYyBiYXVkcmF0ZWAsXG4gICAgYWxpYXM6ICdtJyxcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiA1NjAwMFxuICB9LFxuICBibGlua2luZzoge1xuICAgIGRlc2M6IGBFbmFibGUgYmxpbmtpbmcgdGV4dGAsXG4gICAgYWxpYXM6ICdiJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gIH0sXG4gIHNjcm9sbGluZzoge1xuICAgIGRlc2M6IGBFbmFibGUgc2Nyb2xsaW5nYCxcbiAgICBhbGlhczogJ3MnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgfSxcbiAgdHJhbnNwYXJlbmN5OiB7XG4gICAgZGVzYzogYEVuYWJsZSB0cmFuc3BhcmVuY3lgLFxuICAgIGFsaWFzOiAndCcsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICB9LFxufTtcblxuY29uc3QgaGVscFRleHQgPSBtZW93aGVscCh7XHRuYW1lLFx0ZmxhZ3MsIGNvbW1hbmRzIH0pO1xuY29uc3Qgb3B0aW9ucyA9IHsgaW1wb3J0TWV0YTogaW1wb3J0Lm1ldGEsIGZsYWdzIH07XG5jb25zdCB7IGlucHV0OiBwYXJ0cywgZmxhZ3M6IHF1ZXJ5IH0gPSBtZW93KGhlbHBUZXh0LCBvcHRpb25zKTtcblxuZnVuY3Rpb24gcGFyc2VVUkwoXywgeyBwYXRobmFtZSB9KSB7XG4gIGNvbnN0IGFyZ3YgPSBwYXJzZShwYXRobmFtZSk7XG4gIGNvbnN0IHsgaW5wdXQ6IHBhcnRzLCBmbGFnczogcXVlcnkgfSA9IG1lb3dwYXJzZShhcmd2LCBvcHRpb25zKTtcbiAgcmV0dXJuIHsgcGFydHMsIHF1ZXJ5IH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVVSTChfLCB7IHBhcnRzOiBpbnB1dCwgcXVlcnk6IGZsYWdzIH0pIHtcbiAgY29uc3QgYXJndiA9IG1lb3dyZXYoeyBpbnB1dCwgZmxhZ3MgfSwgb3B0aW9ucyk7XG4gIGNvbnN0IHBhdGhuYW1lID0gcXVvdGUoYXJndik7XG4gIHJldHVybiBuZXcgVVJMKGBhcmd2OiR7cGF0aG5hbWV9YCk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5VVJMKGN1cnJlbnRVUkwpIHtcbiAgZ2xvYmFsVGhpcy5sb2NhdGlvbi5ocmVmID0gY3VycmVudFVSTC5ocmVmO1xufVxuXG5nbG9iYWxUaGlzLmxvY2F0aW9uID0gY3JlYXRlVVJMKG51bGwsIHsgcGFydHMsIHF1ZXJ5IH0pO1xuXG5jb25zdCBTcGVjaWFsQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gQXBwKCkge1xuICB1c2VJbnB1dCgoaW5wdXQpID0+IHtcbiAgICBpZiAoaW5wdXQudG9Mb3dlckNhc2UoKSA9PT0gJ3EnKSB7XG4gICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgfVxuICB9KVxuICAvLyB1c2UgY29tbWFuZC1saW5lIFVSTFxuICBjb25zdCBvdmVycmlkZSA9IHsgY3JlYXRlVVJMLCBwYXJzZVVSTCwgYXBwbHlVUkwgfTtcbiAgY29uc3QgWyBwYXJ0cywgcXVlcnksIHJNZXRob2RzLCB7IGNyZWF0ZUNvbnRleHQsIGNyZWF0ZUJvdW5kYXJ5IH0gXSA9IHVzZVNlcXVlbnRpYWxSb3V0ZXIob3ZlcnJpZGUpO1xuICByZXR1cm4gY3JlYXRlQ29udGV4dCh1c2VTZXF1ZW50aWFsKChzTWV0aG9kcykgPT4ge1xuICAgIGNvbnN0IG1ldGhvZHMgPSB7IC4uLnJNZXRob2RzLCAuLi5zTWV0aG9kcyB9O1xuICAgIGNvbnN0IHsgZmFsbGJhY2ssIHdyYXAsIHRyYXAsIHJlamVjdCB9ID0gbWV0aG9kcztcbiAgICAvLyBkZWZhdWx0IGZhbGxiYWNrIChpc3N1ZSAjMTQyIGluIFJlYWN0LXNlcSAwLjkuMClcbiAgICBmYWxsYmFjayhudWxsKTtcbiAgICAvLyBjcmVhdGUgZXJyb3IgYm91bmRhcnlcbiAgICB3cmFwKGNoaWxkcmVuID0+IGNyZWF0ZUJvdW5kYXJ5KGNoaWxkcmVuKSk7XG4gICAgLy8gcmVkaXJlY3QgZXJyb3IgZnJvbSBib3VuZGFyeSB0byBnZW5lcmF0b3IgZnVuY3Rpb25cbiAgICB0cmFwKCdlcnJvcicsIGVyciA9PiByZWplY3QoZXJyKSk7XG4gICAgLy8gbWV0aG9kIGZvciBtYW5hZ2luZyByb3V0ZVxuICAgIG1ldGhvZHMubWFuYWdlUm91dGUgPSAoKSA9PiBbIHBhcnRzLCBxdWVyeSBdO1xuICAgIHJldHVybiBtYWluKG1ldGhvZHMpO1xuICB9LCBbIHBhcnRzLCBxdWVyeSwgck1ldGhvZHMsIGNyZWF0ZUJvdW5kYXJ5IF0pKTtcbn1cblxucmVuZGVyKDxBcHAgLz4pO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLFNBQVNBLE1BQU0sRUFBRUMsUUFBUSxRQUFRLEtBQUs7QUFDdEMsT0FBT0MsSUFBSSxNQUFNLE1BQU07QUFDdkIsT0FBT0MsUUFBUSxNQUFNLGVBQWU7QUFDcEMsT0FBT0MsT0FBTyxJQUFJQyxTQUFTLFFBQVEsY0FBYztBQUNqRCxPQUFPQyxLQUFLLE1BQU0sc0JBQXNCO0FBQ3hDLE9BQU9DLEtBQUss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