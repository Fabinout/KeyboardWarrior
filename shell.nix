with import ./nix/channel.nix;

let
  dependencies = import ./nix/dependencies.nix;
in pkgs.mkShell ({
  name = "dojo-env";
  buildInputs = dependencies.all;
})

