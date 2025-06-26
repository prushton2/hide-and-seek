FROM nixos/nix

COPY * /workdir/app
RUN nix build .
CMD ["./result/bin/hide-and-seek"]