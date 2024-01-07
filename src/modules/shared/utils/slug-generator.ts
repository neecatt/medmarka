import slugify from 'slugify';
import ShortUniqueId from 'short-unique-id';

slugify.extend({ Ə: 'E', ə: 'e' });
const uid = new ShortUniqueId();

export const generateSlug = (text: string): string => {
    const suid = uid.randomUUID(6);

    const slug = slugify(text, { lower: true, strict: true });

    return `${slug}-${suid}`.replace(/-+/g, '-');
};
