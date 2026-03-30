
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const FZF_FIND_COMMAND: string;
	export const MISE_NODE_DEFAULT_PACKAGES_FILE: string;
	export const __MISE_ORIG_PATH: string;
	export const GITHUB_API_TOKEN: string;
	export const LANGSMITH_API_KEY: string;
	export const TMUX: string;
	export const USER: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const npm_config_user_agent: string;
	export const DISABLE_TELEMETRY: string;
	export const GIT_EDITOR: string;
	export const STARSHIP_SHELL: string;
	export const __MISE_SESSION: string;
	export const FZF_CTRL_T_COMMAND: string;
	export const SSH_AGENT_PID: string;
	export const npm_node_execpath: string;
	export const MISE_ASDF_COMPAT: string;
	export const SHLVL: string;
	export const WT_PROFILE_ID: string;
	export const HOME: string;
	export const MISE_CONFIG_DIR: string;
	export const MISE_DATA_DIR: string;
	export const MOTD_SHOWN: string;
	export const OLDPWD: string;
	export const SAM_CLI_TELEMETRY: string;
	export const AUTOSWITCH_VERSION: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_json: string;
	export const GATSBY_TELEMETRY_DISABLED: string;
	export const OPENAI_API_KEY: string;
	export const STARSHIP_LOG: string;
	export const __MISE_DIFF: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const GOROOT: string;
	export const COLORTERM: string;
	export const COREPACK_ENABLE_STRICT: string;
	export const WSL_DISTRO_NAME: string;
	export const npm_config_prefer_workspace_packages: string;
	export const WAYLAND_DISPLAY: string;
	export const LOGNAME: string;
	export const pnpm_config_verify_deps_before_run: string;
	export const NAME: string;
	export const PULSE_SERVER: string;
	export const WSL_INTEROP: string;
	export const _: string;
	export const MISE_SHELL: string;
	export const CODEBERG_TOKEN: string;
	export const MIX_ARCHIVES: string;
	export const npm_config_registry: string;
	export const npm_config_node_linker: string;
	export const AUTOSWITCH_FILE: string;
	export const TERM: string;
	export const OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
	export const ZSH_CACHE_DIR: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const ANTHROPIC_API_KEY: string;
	export const NEXT_TELEMETRY_DISABLED: string;
	export const GOBIN: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const WT_SESSION: string;
	export const XDG_RUNTIME_DIR: string;
	export const __MISE_ENV_CACHE_KEY: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const npm_config_frozen_lockfile: string;
	export const DISPLAY: string;
	export const GITLAB_TOKEN: string;
	export const IGNORE_FILE_WILD: string;
	export const PYTHONSTARTUP: string;
	export const LANG: string;
	export const NoDefaultCurrentDirectoryInExePath: string;
	export const TERM_PROGRAM: string;
	export const XDG_CONFIG_HOME: string;
	export const npm_lifecycle_script: string;
	export const SSH_AUTH_SOCK: string;
	export const STARSHIP_CONFIG: string;
	export const SHELL: string;
	export const npm_package_version: string;
	export const npm_config_verify_deps_before_run: string;
	export const npm_lifecycle_event: string;
	export const CLOUDFLARE_API_TOKEN: string;
	export const MISE_HOOK_ENV_CHPWD_ONLY: string;
	export const MIX_HOME: string;
	export const npm_config_npm_globalconfig: string;
	export const CLAUDECODE: string;
	export const MISE_CARGO_DEFAULT_PACKAGES_FILE: string;
	export const MISE_PYTHON_DEFAULT_PACKAGES_FILE: string;
	export const __MISE_ZSH_PRECMD_RUN: string;
	export const npm_config_globalconfig: string;
	export const FZF_DEFAULT_COMMAND: string;
	export const MISE_HOOK_ENV_CACHE_TTL: string;
	export const PWD: string;
	export const JAVA_HOME: string;
	export const npm_config_link_workspace_packages: string;
	export const npm_execpath: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_recursive: string;
	export const STARSHIP_SESSION_KEY: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const npm_config__jsr_registry: string;
	export const npm_command: string;
	export const MISE_PYTHON_COMPILE: string;
	export const AUTOSWITCH_SILENT: string;
	export const HOSTTYPE: string;
	export const TMUX_PANE: string;
	export const WSL2_GUI_APPS_ENABLED: string;
	export const EDITOR: string;
	export const GOOGLE_API_KEY: string;
	export const IGNORE_FILE_EXT: string;
	export const WSLENV: string;
	export const INIT_CWD: string;
	export const TEST: string;
	export const VITEST: string;
	export const NODE_ENV: string;
	export const PROD: string;
	export const DEV: string;
	export const BASE_URL: string;
	export const MODE: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		FZF_FIND_COMMAND: string;
		MISE_NODE_DEFAULT_PACKAGES_FILE: string;
		__MISE_ORIG_PATH: string;
		GITHUB_API_TOKEN: string;
		LANGSMITH_API_KEY: string;
		TMUX: string;
		USER: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		npm_config_user_agent: string;
		DISABLE_TELEMETRY: string;
		GIT_EDITOR: string;
		STARSHIP_SHELL: string;
		__MISE_SESSION: string;
		FZF_CTRL_T_COMMAND: string;
		SSH_AGENT_PID: string;
		npm_node_execpath: string;
		MISE_ASDF_COMPAT: string;
		SHLVL: string;
		WT_PROFILE_ID: string;
		HOME: string;
		MISE_CONFIG_DIR: string;
		MISE_DATA_DIR: string;
		MOTD_SHOWN: string;
		OLDPWD: string;
		SAM_CLI_TELEMETRY: string;
		AUTOSWITCH_VERSION: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_json: string;
		GATSBY_TELEMETRY_DISABLED: string;
		OPENAI_API_KEY: string;
		STARSHIP_LOG: string;
		__MISE_DIFF: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		GOROOT: string;
		COLORTERM: string;
		COREPACK_ENABLE_STRICT: string;
		WSL_DISTRO_NAME: string;
		npm_config_prefer_workspace_packages: string;
		WAYLAND_DISPLAY: string;
		LOGNAME: string;
		pnpm_config_verify_deps_before_run: string;
		NAME: string;
		PULSE_SERVER: string;
		WSL_INTEROP: string;
		_: string;
		MISE_SHELL: string;
		CODEBERG_TOKEN: string;
		MIX_ARCHIVES: string;
		npm_config_registry: string;
		npm_config_node_linker: string;
		AUTOSWITCH_FILE: string;
		TERM: string;
		OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
		ZSH_CACHE_DIR: string;
		npm_config_node_gyp: string;
		PATH: string;
		ANTHROPIC_API_KEY: string;
		NEXT_TELEMETRY_DISABLED: string;
		GOBIN: string;
		NODE: string;
		npm_package_name: string;
		WT_SESSION: string;
		XDG_RUNTIME_DIR: string;
		__MISE_ENV_CACHE_KEY: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		npm_config_frozen_lockfile: string;
		DISPLAY: string;
		GITLAB_TOKEN: string;
		IGNORE_FILE_WILD: string;
		PYTHONSTARTUP: string;
		LANG: string;
		NoDefaultCurrentDirectoryInExePath: string;
		TERM_PROGRAM: string;
		XDG_CONFIG_HOME: string;
		npm_lifecycle_script: string;
		SSH_AUTH_SOCK: string;
		STARSHIP_CONFIG: string;
		SHELL: string;
		npm_package_version: string;
		npm_config_verify_deps_before_run: string;
		npm_lifecycle_event: string;
		CLOUDFLARE_API_TOKEN: string;
		MISE_HOOK_ENV_CHPWD_ONLY: string;
		MIX_HOME: string;
		npm_config_npm_globalconfig: string;
		CLAUDECODE: string;
		MISE_CARGO_DEFAULT_PACKAGES_FILE: string;
		MISE_PYTHON_DEFAULT_PACKAGES_FILE: string;
		__MISE_ZSH_PRECMD_RUN: string;
		npm_config_globalconfig: string;
		FZF_DEFAULT_COMMAND: string;
		MISE_HOOK_ENV_CACHE_TTL: string;
		PWD: string;
		JAVA_HOME: string;
		npm_config_link_workspace_packages: string;
		npm_execpath: string;
		XDG_DATA_DIRS: string;
		npm_config_recursive: string;
		STARSHIP_SESSION_KEY: string;
		PNPM_SCRIPT_SRC_DIR: string;
		npm_config__jsr_registry: string;
		npm_command: string;
		MISE_PYTHON_COMPILE: string;
		AUTOSWITCH_SILENT: string;
		HOSTTYPE: string;
		TMUX_PANE: string;
		WSL2_GUI_APPS_ENABLED: string;
		EDITOR: string;
		GOOGLE_API_KEY: string;
		IGNORE_FILE_EXT: string;
		WSLENV: string;
		INIT_CWD: string;
		TEST: string;
		VITEST: string;
		NODE_ENV: string;
		PROD: string;
		DEV: string;
		BASE_URL: string;
		MODE: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
