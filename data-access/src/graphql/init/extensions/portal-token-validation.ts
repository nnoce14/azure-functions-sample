export type OpenIdConfig = {
    issuerUrl: string;
    oidcEndpoint: string;
    audience: any;
}

export class PortalTokenValidation {
    private tokenSettings: Map<string,OpenIdConfig>;
    

    constructor(portals: Map<string,string>) {
        this.tokenSettings = new Map<string,OpenIdConfig>();

        for(let [portalKey, envPrefix] of portals){
            this.tokenSettings.set(
              portalKey,
              {
                oidcEndpoint: this.tryGetConfigValue(envPrefix + '_OIDC_ENDPOINT'),    
                audience: this.tryGetConfigValue(envPrefix + '_OIDC_AUDIENCE'),
                issuerUrl: this.tryGetConfigValue(envPrefix + '_OIDC_ISSUER')
              } as OpenIdConfig
            );
          }
    }

    public tryGetConfigValue(configKey:string) {
        if(process.env.hasOwnProperty(configKey)){
          return process.env[configKey];
        }else{
           console.log(`[PortalTokenValidation] - Environment variable ${configKey} not set`);
        }
    }
}