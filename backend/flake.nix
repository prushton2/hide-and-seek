{
  inputs = {
    nixpkgs.url = "https://github.com/NixOS/nixpkgs/archive/refs/tags/25.05.tar.gz"
  };
  outputs = { self, nixpkgs }: {
    let
      pkgs = import nixpkgs.x86_64-linux;
    in {
      packages.x86_64-linux.go = pkgs.go;
      packages.x86_64-linux.gcc = pkgs.gcc;
    }
  };
}