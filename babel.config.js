module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: 'commonjs', // Transform ES modules to CommonJS for Jest
    }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    // Transform import.meta.env to process.env for Jest
    function() {
      return {
        visitor: {
          MemberExpression(path) {
            // Check if this is import.meta.env.*
            if (path.node.object &&
                path.node.object.type === 'MemberExpression' &&
                path.node.object.object &&
                path.node.object.object.type === 'MetaProperty' &&
                path.node.object.object.meta.name === 'import' &&
                path.node.object.object.property.name === 'meta' &&
                path.node.object.property &&
                path.node.object.property.name === 'env' &&
                path.node.property) {
              const propertyName = path.node.property.name || (path.node.property.value || '')
              if (propertyName === 'DEV') {
                // Replace with process.env.NODE_ENV !== 'production'
                path.replaceWithSourceString('process.env.NODE_ENV !== "production"')
              } else if (propertyName) {
                // Replace other import.meta.env.* with process.env.*
                path.replaceWithSourceString('process.env.' + propertyName)
              }
            }
          }
        }
      }
    }
  ],
};

