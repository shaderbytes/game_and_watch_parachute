const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: "./",
  transpileDependencies: true,
  configureWebpack: {

    module: {

      rules: [{

                test: /\.(glb)$/i,

                use: [{

                    loader: 'file-loader',

                    options: {

                      outputPath: 'glb',


                    },

                   

                }, ],

            },{

              test: /\.(env)$/i,

              use: [{

                  loader: 'file-loader',

                  options: {

                    outputPath: 'env',

                  },

                 

              }, ],

          }],

    },

  },
})
