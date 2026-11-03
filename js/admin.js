import { registerUswdsCardGroupEditorComponent } from "./cms/uswds-card-group-editor-component.mjs";

import { registerUswdsSummaryBoxEditorComponent } from "./cms/uswds-summary-box-editor-component.mjs";

registerUswdsCardGroupEditorComponent(window.CMS);
registerUswdsSummaryBoxEditorComponent(window.CMS);
window.CMS.init();
