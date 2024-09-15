export default defineConfig({
  base: "/", // Root path for assets
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
