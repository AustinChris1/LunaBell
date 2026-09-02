declare module '@nimiq/identicons' {
  const Identicons: {
    svg: (text: string) => Promise<string>
    toDataUrl: (text: string) => Promise<string>
  }
  export default Identicons
}
