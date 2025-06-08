let  
  bython-prushton = pkgs.python313Packages.buildPythonPackage rec {
    pname = "bython_prushton";
    version = "1.2.1";
    format = "pyproject";

    buildInputs = [
      pkgs.python313Packages.hatchling
    ];

    src = pkgs.python313Packages.fetchPypi{
      inherit version pname;
      sha256 = "sha256-5CCC75UeEo/doyGVewbK59+PYutsgdVXVKARd3BSLLc=";
    };
  };

  bigxml = pkgs.python313Packages.buildPythonPackage rec {
    pname = "bigxml";
    version = "1.1.0";
    format = "pyproject";

    buildInputs = [
      pkgs.python313Packages.hatchling
      pkgs.python313Packages.hatch-vcs
      pkgs.python313Packages.defusedxml
    ];

    src = pkgs.python313Packages.fetchPypi{
      inherit version pname;
      sha256 = "sha256-7yKBYrKeJcM7w3hexdJ1xngyXnCTkpqVkr8YH1ij4vY=";
    };
  };
  
  pkgs = import (
    # Latest as of 8 June 2025
    fetchTarball "https://github.com/NixOS/nixpkgs/archive/8207ad0d501d.tar.gz"
  ) {};
in pkgs.mkShell {
  packages = [
    (pkgs.python313.withPackages (python-pkgs: with python-pkgs; [
      bython-prushton
      shapely
      pandas
      bigxml
      defusedxml
    ]))
  ];
}