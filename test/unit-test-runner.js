// test/unit-test-runner.js

const output = document.getElementById("test-output") || document.body.appendChild(document.createElement("pre"));

let testGroups = [];
let currentGroup = null;

function log(message, status = "info") {
  const line = document.createElement("div");
  line.className = status;
  line.textContent = message;
  output.appendChild(line);
}

export function group(name, callback) {
  currentGroup = { name, tests: [] };
  testGroups.push(currentGroup);
  log(`\n[${name}]`, "info");
  callback();
}

export function test(name, fn) {
  try {
    const result = fn();
    if (result instanceof Promise) {
      result
        .then(() => log(`✔ ${name}`, "pass"))
        .catch((e) => log(`✖ ${name}: ${e}`, "fail"));
    } else {
      log(`✔ ${name}`, "pass");
    }
  } catch (err) {
    log(`✖ ${name}: ${err}`, "fail");
  }
}

export const assert = {
  equal(actual, expected) {
    if (actual !== expected) throw new Error(`Expected '${actual}' to equal '${expected}'`);
  },
  truthy(value) {
    if (!value) throw new Error(`Expected value to be truthy, got '${value}'`);
  },
  falsy(value) {
    if (value) throw new Error(`Expected value to be falsy, got '${value}'`);
  },
};

export function runTests() {
  log("\nAll tests completed. Check above for results.\n");
}
