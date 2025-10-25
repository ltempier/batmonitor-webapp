const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "~/components": path.resolve(__dirname, "src/components"),
      "~/components/ui": path.resolve(__dirname, "src/components/ui"),
      "~/lib/utils": path.resolve(__dirname, "src/lib/utils"),
      "~/hooks": path.resolve(__dirname, "src/hooks")
    }
  }
};