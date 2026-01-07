import { isLanguageMixed, isLLMRefusal } from "../lib/utils/language";

console.log("Running Language Control v2 Verification Tests...");

const testCases = [
    { text: "สวัสดีครับ", target: "th", expected: false },
    { text: "안녕하세요", target: "kr", expected: false },
    { text: "안녕하세요 สวัสดี", target: "th", expected: true },
    { text: "AI Algorithm in Thai", target: "th", expected: false },
    { text: "HOOK: Title in Korean", target: "kr", expected: false },
    { text: "I'm sorry, I cannot fulfill this request.", isRefusal: true },
    { text: "As an AI language model...", isRefusal: true },
    { text: "안녕하세요, 무엇을 도와드릴까요?", isRefusal: false }
];

let failed = 0;

testCases.forEach((c, i) => {
    if ("target" in c) {
        const result = isLanguageMixed(c.text, c.target as string);
        const pass = result === c.expected;
        if (!pass) failed++;
        console.log(`Case ${i} (Mixed?): ${pass ? '✅' : '❌'} - "${c.text}" (Target: ${c.target})`);
    }
    if ("isRefusal" in c) {
        const result = isLLMRefusal(c.text);
        const pass = result === c.isRefusal;
        if (!pass) failed++;
        console.log(`Case ${i} (Refusal?): ${pass ? '✅' : '❌'} - "${c.text}"`);
    }
});

if (failed === 0) {
    console.log("\nALL TESTS PASSED ✨");
} else {
    console.log(`\n${failed} TESTS FAILED ❌`);
    process.exit(1);
}
