declare module 'react-native-phone-call' {
	type args = {
		/**
		 * Number to call. 
		 */
		number: string;
		/**
		 * If the user should be prompted prior to the call 
		 */
		prompt?: boolean;
		/**
		 * Skip the canOpenURL check
		 */
		skipCanOpen?: boolean;
	};

	export default function call(args: args): Promise<void>;
}
