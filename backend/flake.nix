{
  description = "Hide and seek";

  inputs = {
    nixpkgs.url = "https://github.com/NixOS/nixpkgs/archive/refs/tags/25.05.tar.gz";
  };

  outputs = { self, nixpkgs }:
    let
      pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in
    {
      packages.x86_64-linux.hide-and-seek = pkgs.buildGoModule {
        pname = "hide-and-seek";
        version = "0.1.0";
        src = ./.;
        vendorHash = "sha256-mGKxBRU5TPgdmiSx0DHEd0Ys8gsVD/YdBfbDdSVpC3U=";
        doCheck = false;
      };

      devShells.x86_64-linux.default = pkgs.mkShell {
        name = "hide-and-seek-backend";
        packages = with pkgs; [
          go
          gcc
        ];
      };
    };
}
