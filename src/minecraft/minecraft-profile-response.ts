export interface MinecraftProfileResponse {
  id: string;
  name: string;
  skins: [
    {
      id: string;
      state: string;
      url: string;
      variant: string;
      alias: string;
    }
  ];
  capes: [];
}
