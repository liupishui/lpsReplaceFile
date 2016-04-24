module.exports={
    replaceFileWithStr:function(content,cwd){
        /***target:更改String代码段，将里面的如{include demo/file.html}的代码替换为cwd工作目录下对应的demo/file.html模板内容。
            pam:srcpath:源文件路径;
                cwd:模板文件{include demo/demo.html}相对package.json根目录的路径，默认为package.json的相对路径;
            return:函数返回替换后的文件
        ***/
        var libFs = require("fs"); //文件系统模块
        var libPath = require("path"); //路径解析模块
                //循环替换替换文本
                var fileContentsTmp=content instanceof Buffer ? content.toString() : content;
                var replaceFileCon=function(){
                    //判断是否存在需要替换的文件
                    var templateHolders = fileContentsTmp.match(/\{include [^\}]+\}/g);
                        if(templateHolders){
                            var RegExpPam=templateHolders[0];
                            var regN=RegExp(RegExpPam,'g');//正则模板替换
                            var pathTemp=templateHolders[0].match(/ ([^\}]+)/)[1];
                            if(cwd){
                                pathTemp=cwd+'\\'+pathTemp;
                            }
                            if(libFs.existsSync(pathTemp)){
                                var fileTemp=libFs.readFileSync(pathTemp);
                                if(fileTemp){
                                    fileTemp=fileTemp instanceof Buffer ?fileTemp.toString():fileTemp;
                                    fileContentsTmp=fileContentsTmp.replace(regN,fileTemp);
                                    replaceFileCon();
                                }else{
                                    fileContentsTmp=fileContentsTmp.replace(
                                        regN,"<span style='color:#f00;'>读取文件"+pathTemp+'失败</span>');
                                    replaceFileCon()
                                }
                            }else{
                                    fileContentsTmp=fileContentsTmp.replace(
                                        regN,"<span style='color:#f00;'>文件"+pathTemp+'不存在</span>');
                                    replaceFileCon()
                            }
                        }
                }
                replaceFileCon();
                content=fileContentsTmp;
                return content;

    },
    replaceFileWithPath:function(srcpath,cwd){
        /***target:读取路径文件，如果为html则替换里面的{include demo/file.html}为demo/file.html内的内容。如果cwd存在(如cwd='./temp/')，则替换{include demo/file.html}为./temp/demo/file.html内的内容
            pam:srcpath:源文件路径;
                cwd:模板文件{include demo/demo.html}相对package.json根目录的路径;
            return:函数返回替换后的文件
            例如:srcpath='demo/demo.html',cwd='./temp/';则文件实际路径为'./temp/demo/demo.html'
        ***/
        var libFs = require("fs"); //文件系统模块
        var libPath = require("path"); //路径解析模块
        var fileType = srcpath.substring(srcpath.length - 5).toLowerCase();
        var fileContents='';
        if (libFs.existsSync(srcpath)) { //文件是否存在
            var fileContents = libFs.readFileSync(srcpath);
            if (fileType === ".html") { //是否为html文件
                fileContents=this.replaceFileWithStr(fileContents,cwd);
            }
            return fileContents;
        }else{
            return false;
        }
    }
};
