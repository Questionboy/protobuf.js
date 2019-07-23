var tape = require("tape");

var protobuf  = require("..");

var PROTO = "syntax = \"proto3\";\
message RepDouble {\
    bool spacer = 1;\
    repeated double foo = 2;\
}\
\
message RepFloat {\
    bool spacer = 1;\
    repeated float foo = 2;\
}\
\
message RepFixed32 {\
    bool spacer = 1;\
    repeated fixed32 foo = 2;\
}\
\
message RepSFixed32 {\
    bool spacer = 1;\
    repeated sfixed32 foo = 2;\
}\
\
message RepFixed64 {\
    bool spacer = 1;\
    repeated fixed64 foo = 2;\
}\
\
message RepSFixed64 {\
    bool spacer = 1;\
    repeated sfixed64 foo = 2;\
}\
";

var TEST_DATA = {foo: [1, 2, 3]};
var UNALIGNED_DATA = {spacer: false, ...TEST_DATA};

// TODO: import this function from util
function typedArrayIsLe()
{
    var f32 = new Float32Array([ -0 ]),
        f8b = new Uint8Array(f32.buffer);
    return f8b[3] === 128;
}

function testTypedArray(test, typeName, typedArray, data)
{
    var root = protobuf.parse(PROTO).root;

    var RepeatedType = root[typeName];
    var buf = RepeatedType.encode(data).finish();
    var msg = RepeatedType.decode(buf);

    test.ok(msg.foo instanceof typedArray, `Array came back as ${typedArray}`);
    test.deepEqual(msg, data);
}

tape.test("readFixedAsTypedArray", function(test) {
    if (typedArrayIsLe())
    {
        testTypedArray(test, 'RepFloat', Float32Array, TEST_DATA);
        testTypedArray(test, 'RepDouble', Float64Array, TEST_DATA);
        testTypedArray(test, 'RepFixed32', Uint32Array, TEST_DATA);
        testTypedArray(test, 'RepSFixed32', Int32Array, TEST_DATA);

        testTypedArray(test, 'RepFloat', Float32Array, UNALIGNED_DATA);
        testTypedArray(test, 'RepDouble', Float64Array, UNALIGNED_DATA);
        testTypedArray(test, 'RepFixed32', Uint32Array, UNALIGNED_DATA);
        testTypedArray(test, 'RepSFixed32', Int32Array, UNALIGNED_DATA);
    }

    // TODO: only conditionally use this option
    // TODO: according to https://kangax.github.io/compat-table/esnext/
    // node LTS should have this, so have support (10.16)

    // NOTE: we dont' support BigUint64Array because access
    // requires the creation of BitInt's, which are arbitrary
    // precision integer types.
    //testTypedArray(test, 'RepFixed64', BigUint64Array, DATA);
    //testTypedArray(test, 'RepSFixed64', BigInt64Array, DATA);
    //
    //testTypedArray(test, 'RepFixed64', BigUint64Array, UNALIGNED_DATA);
    //testTypedArray(test, 'RepSFixed64', BigInt64Array, UNALIGNED_DATA);

    test.end();
});
