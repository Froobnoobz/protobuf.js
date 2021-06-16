"use strict";
var child_process = require("child_process"),
    path     = require("path"),
    fs       = require("fs"),
    pkg      = require("./package.json"),
    util     = require("./util");

util.setup();

var minimist = require("minimist"),
    chalk    = require("chalk"),
    glob     = require("glob"),
    tmp      = require("tmp");

/**
 * Runs pbts programmatically.
 * @param {string[]} args Command line arguments
 * @param {function(?Error, string=)} [callback] Optional completion callback
 * @returns {number|undefined} Exit code, if known
 */
exports.main = function(args, callback) {
    var argv = minimist(args, {
        alias: {
            name: "n",
            out : "o",
            main: "m",
            global: "g",
            import: "i"
        },
        string: [ "name", "out", "global", "import" ],
        boolean: [ "comments", "main" ],
        default: {
            comments: true,
            main: false
        }
    });

    var files  = argv._;

    if (!files.length) {
        if (callback)
            callback(Error("usage")); // eslint-disable-line callback-return
        else
            process.stderr.write([
                "protobuf.js v" + pkg.version + " CLI for TypeScript",
                "",
                chalk.bold.white("Generates TypeScript definitions from annotated JavaScript files."),
                "",
                "  -o, --out       Saves to a file instead of writing to stdout.",
                "",
                "  -g, --global    Name of the global object in browser environments, if any.",
                "",
                "  -i, --import    Comma delimited list of imports. Local names will equal camelCase of the basename.",
                "",
                "  --no-comments   Does not output any JSDoc comments.",
                "",
                chalk.bold.gray("  Internal flags:"),
                "",
                "  -n, --name      Wraps everything in a module of the specified name.",
                "",
                "  -m, --main      Whether building the main library without any imports.",
                "",
                "usage: " + chalk.bold.green("pbts") + " [options] file1.js file2.js ..." + chalk.bold.gray("  (or)  ") + "other | " + chalk.bold.green("pbts") + " [options] -",
                ""
            ].join("\n"));
        return 1;
    }

    // Resolve glob expressions
    for (var i = 0; i < files.length;) {
        if (glob.hasMagic(files[i])) {
            var matches = glob.sync(files[i]);
            Array.prototype.splice.apply(files, [i, 1].concat(matches));
            i += matches.length;
        } else
            ++i;
    }

    var cleanup = [];

    // Read from stdin (to a temporary file)
    if (files.length === 1 && files[0] === "-") {
        var data = [];
        process.stdin.on("data", function(chunk) {
            data.push(chunk);
        });
        process.stdin.on("end", function() {
            files[0] = tmp.tmpNameSync() + ".js";
            fs.writeFileSync(files[0], Buffer.concat(data));
            cleanup.push(files[0]);
            // callJsdoc();
        });

    // Load from disk
    } else {
        // callJsdoc();
    }
    return undefined;
};
