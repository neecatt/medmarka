import fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import mjml2html from 'mjml';
import { TemplateContext } from '../types/template-context';
import { WEB_BASE_URL } from '@config/environment';

const DEFAULT_CONTEXT = {
    WEBSITE_URL: WEB_BASE_URL,
    FACEBOOK: 'https://www.facebook.com/example-app.com',
    INSTAGRAM: 'https://www.instagram.com/example-app.com',
    LINKEDIN: 'https://www.linkedin.com/example-app.com',
    TWITTER: 'https://www.twitter.com/example-app.com',
};

type TemplateType = 'email' | 'push' | 'web-push' | 'sms' | 'telegram';

@Injectable()
export class TemplateService {
    compileTemplate(templateName: string, context: TemplateContext, type: TemplateType): string {
        const templatePath = this.generateTemplatePath(templateName, type);

        const templateMjml = fs.readFileSync(templatePath, { encoding: 'utf-8' });

        const pageMjml = this.compilePageMjml(templateMjml, type);

        if (context.RAW) {
            pageMjml.replace('{{{RAW}}}', context.RAW);
        }

        return this.compilePageText(pageMjml, context, type);
    }

    private compilePageMjml(templateMjml: string, type: TemplateType): string {
        const layoutPath = this.generateLayoutPath(type);

        const layoutMjmlText = fs.readFileSync(layoutPath, { encoding: 'utf-8' });

        const result = layoutMjmlText.replace('{{{BODY}}}', templateMjml);

        return result;
    }

    private compilePageText(pageMjml: string, context: TemplateContext, type: TemplateType): string {
        const template = handlebars.compile(pageMjml);

        const compiledMjml = template({ ...DEFAULT_CONTEXT, ...context });

        if (type !== 'email') {
            return compiledMjml;
        }
        const mjmlParseResult = mjml2html(compiledMjml, { keepComments: false });

        return mjmlParseResult.html;
    }

    private generateTemplatePath(templateName: string, type: TemplateType): string {
        const filePath = path.join(global.__basedir, `templates/views/${templateName}`, `${templateName}.${type}.mjml`);
        return filePath;
    }

    private generateLayoutPath(type: TemplateType): string {
        const layoutPath = path.join(global.__basedir, 'templates/layouts', `default.${type}.mjml`);
        return layoutPath;
    }
}
