import lowercaseKeys from 'lowercase-keys';
import { DOCS_DOCUMENTING } from '../../scripts/consts';

const hasStringModifiers = (modifiers: string): boolean => !!modifiers.match(/^[ \w]+$/);

interface Error {
	error: string;
}
/**
 * Split fenced code block header to lang and modifiers, parse modifiers, lowercase modifier keys, etc.
 */
export default function parseExample(
	content: string,
	lang?: string | null,
	modifiers?: string,
	updateExample: (example: Rsg.CodeExample) => Rsg.CodeExample = x => x
): Rsg.CodeExample | Error {
	const example: Rsg.CodeExample = {
		content,
		lang,
	};

	if (modifiers) {
		if (hasStringModifiers(modifiers)) {
			example.settings = modifiers.split(' ').reduce((obj: Record<string, any>, modifier) => {
				obj[modifier] = true;
				return obj;
			}, {});
		} else {
			try {
				example.settings = JSON.parse(modifiers);
			} catch (err) {
				return {
					error: `Cannot parse modifiers for "${modifiers}". Use space-separated strings or JSON:\n\n${DOCS_DOCUMENTING}`,
				};
			}
		}
	}

	const updatedExample = updateExample(example);
	return {
		...updatedExample,
		settings: lowercaseKeys(updatedExample.settings || {}),
	};
}
