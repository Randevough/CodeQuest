import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
for (const path of ['./DeleteQuestModal.tsx', './MemberActionMenu.tsx', './submissions/SubmissionReviewModal.tsx']) {
    const source = read(path);
    assert.match(source, /import \{ Dialog \} from '@\/components\/ui\/Dialog'/);
    assert.match(source, /<Dialog[^\n]*pending=\{/);
}
const member = read('./MemberActionMenu.tsx');
assert.match(member, /confirmText !== 'CONFIRM'/);
assert.match(member, /assignQuest\(user.id, selectedQuestId, force\)/);
assert.match(member, /handleAssignQuest\(true\)/);
assert.match(member, /if \(!selectedQuestId \|\| isAssigning \|\| isPending\) return/);
const actions = read('../../app/admin/manage-quests/QuestActions.tsx');
assert.equal((actions.match(/disabled=\{activeSnatchesCount > 0\}/g) || []).length, 2);
assert.match(read('./submissions/SubmissionReviewModal.tsx'), /status === 'REVISION_NEEDED' && !feedback.trim\(\)/);
assert.match(read('./QuestForm.tsx'), /role="alert"/);
assert.match(actions, /popover="auto"/);
assert.match(actions, /popoverTarget=\{menuId\}/);
assert.match(actions, /menu\.showPopover\(\)/);
assert.match(actions, /window\.innerHeight - menu\.offsetHeight - 8/);
assert.doesNotMatch(actions, /className="absolute right-0/);
for (const path of ['./QuestForm.tsx', './QuestFilters.tsx', './MemberActionMenu.tsx']) {
    // JSX handlers contain >, so inspect through each control's closing tag.
    for (const control of read(path).matchAll(/<(?:input|textarea)\b[\s\S]*?(?:\/>|<\/textarea>)/g)) {
        assert.doesNotMatch(control[0], /\bborder-border\b/, `${path}: control border`);
    }
}
const queue = read('../../app/admin/submissions/page.tsx');
assert.match(queue, /key=\{selectedSnatchId\}/);
assert.match(queue, /ref=\{queueHeadingRef\} tabIndex=\{-1\}/);
assert.match(queue, /requestAnimationFrame\(\(\) => queueHeadingRef.current\?\.focus\(\)\)/);
const review = read('./submissions/SubmissionReviewModal.tsx');
assert.match(review, /setMessage\(''\);\s*setIsSubmitting\(true\)/);
assert.match(review, /'Advanced'[\s\S]*?'bg-surface  text-danger/);
const quests = read('../../app/admin/manage-quests/page.tsx');
assert.match(quests, /flex flex-col gap-4 sm:flex-row/);
assert.match(quests, /d === 'advanced'[\s\S]*?text-danger/);
assert.match(quests, /d === 'exclusive'[\s\S]*?text-warning/);
const charts = read('./AdminCharts.tsx');
assert.match(charts, /'Advanced': 'var\(--color-danger\)'/);
assert.match(charts, /<Legend[^\n]*formatter=[^\n]*text-muted/);
console.log('Admin UI source guards passed. Browser behavior not tested.');
