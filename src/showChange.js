import differ from 'deep-diff';
import isPlainObject from 'lodash/isPlainObject';
import isCircular from 'is-circular';

// https://github.com/flitbit/diff#differences
const dictionary = {
  E: {
    color: '#2196F3',
    text: 'CHANGED:',
  },
  N: {
    color: '#4CAF50',
    text: 'ADDED:',
  },
  D: {
    color: '#F44336',
    text: 'DELETED:',
  },
  A: {
    color: '#2196F3',
    text: 'ARRAY:',
  },
};

export function style(kind) {
  return `color: ${dictionary[kind].color}; font-weight: bold`;
}

export function render(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
    case 'E':
      return [path.join('.'), lhs, '→', rhs];
    case 'N':
      return [path.join('.'), rhs];
    case 'D':
      return [path.join('.')];
    case 'A':
      return [`${path.join('.')}[${index}]`, item];
    default:
      return [];
  }
}

function diffLogger(prevState, newState, logger, isCollapsed) {
  const diff = differ(prevState, newState);

  try {
    if (isCollapsed) {
      logger.groupCollapsed('diff');
    } else {
      logger.group('diff');
    }
  } catch (e) {
    logger.log('diff');
  }

  if (diff) {
    diff.forEach((elem) => {
      const { kind } = elem;
      const output = render(elem);

      logger.log(`%c ${dictionary[kind].text}`, style(kind), ...output);
    });
  } else {
    logger.log('—— no diff ——');
  }

  try {
    logger.groupEnd();
  } catch (e) {
    logger.log('—— diff end —— ');
  }
}

function canBeDiffed(x) {
  return isPlainObject(x) && !isCircular(x);
}

export default function (name, key, beforeObj, afterObj) {
  const before = beforeObj[key];
  const after = afterObj[key];
  console.log(
    '%c' + name,
    'font-weight: bold;',
  );

  if (canBeDiffed(before) && canBeDiffed(after)) {
    diffLogger(before, after, console, false);
  } else {
    console.log('before:', before, 'after:', after);
  }
}
