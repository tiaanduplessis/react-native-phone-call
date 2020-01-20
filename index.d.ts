declare module 'react-native-phone-call' {
	type args = {
		number: string;
		prompt?: boolean;
	};

	export default function call(args: args): Promise<void>;
}
