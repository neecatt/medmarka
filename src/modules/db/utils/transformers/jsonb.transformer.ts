import { ValueTransformer } from 'typeorm';

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
    return typeof obj === 'undefined' || obj === null;
}

const parseJSON = <T>(json: string): T | undefined => {
    return JSON.parse(json, (_: string, value: any): any => {
        if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
            const date = Date.parse(value);
            if (!isNaN(date)) {
                return new Date(date);
            }
        }
        return value;
    });
};

export class JsonbTransformer<T> implements ValueTransformer {
    constructor(private readonly defaultValue?: T) {}

    public from(value?: any | null): T | undefined {
        if (isNullOrUndefined(value)) {
            return this.defaultValue;
        }

        try {
            const json = JSON.stringify(value);
            return parseJSON(json);
        } catch (e) {
            return this.defaultValue;
        }
    }

    public to(value?: T | null): T | null {
        return value;
    }
}
