export default class EnvManager<const T extends Record<string, string>> {
    private readonly _defaults: T;
    private readonly _env: T;

    constructor(defaults: T) {
        this._defaults = defaults;
        this._env = process.env as T;
    }
    get(varname: keyof typeof this._defaults) {
        if (!(varname in this._defaults)) throw `Env var ${varname.toString()} is not allowed`;
        return varname in this._env ? this._env[varname.toString()] : this._defaults[varname.toString()]
    }
}