import { ValueTransformer } from 'typeorm';

export class NumericTransformer implements ValueTransformer {
    to(data?: number | null): number | null {
        if (!(data === undefined || data === null)) {
            return data;
        }
        return null;
    }

    from(data?: string | null): number | null {
        if (!(data === undefined || data === null)) {
            const res = parseFloat(data);
            if (isNaN(res)) {
                return null;
            } else {
                return res;
            }
        }
        return null;
    }
}
