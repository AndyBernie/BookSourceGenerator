const path = require('path')
const fs = require('fs')
const basePath = "./booksources"
const ruleBookInfo = "./RuleTemplate/ruleBookInfo.json"
const outputFilePath = "./booksource.json"

var booksource = []

mapDir(
  basePath,
  function(file, pathname, filesLength) {
      let json = addRule(file, pathname)
      booksource.push(json)
      combinateSource(filesLength)
  }
)

//添加默认规则
function addRule(file, pathname) {
    var json = JSON.parse(file);
    //书源备注meta时自动添加数据详情页的对应规则
    if (json.bookSourceComment.match("meta")) {
        console.log(json.bookSourceName + " > 添加书籍详情页meta规则...")
        replaceWithTemplate(ruleBookInfo, "ruleBookInfo", ["author","coverUrl","intro","kind","lastChapter","name"])
    }

    var output = JSON.stringify(json);
    fs.writeFileSync(pathname, output, {
        encoding: "utf-8"
    })
    return output
    
    function replaceWithTemplate(templatePath, tar, obejectArray) {
        var  ruleJson = fs.readFileSync(templatePath, {
            encoding: "utf-8"
        });
        if (obejectArray == undefined) {
            json[tar] = ruleJson
        } else {
            obejectArray.forEach(object => {
                if (json[tar][object] == "" || !json[tar][object]) {
                    json[tar][object] = JSON.parse(ruleJson)[object]
                }
            })
        }
    }
}

//合并书源json
function combinateSource(filesLength) {
    let _count = booksource.length
    if (_count == filesLength) {
        let content = "[" + booksource.join(",") + "]"
        fs.writeFileSync(outputFilePath, content, {
                encoding: "utf-8"
            });
        console.log("合并书源中...")
        updateREADME()
    }
}

//更新README.md
function updateREADME() {
console.log("更新README.md")
//todo
}

//遍历文件夹下的文件
//https://blog.csdn.net/example440982/article/details/99677900
function mapDir(dir, callback) {
  fs.readdir(dir, function(err, files) {
    if (err) {
      console.error(err)
      return
    }
    for (index in files) {
      let filename = files[index]
      let pathname = path.join(dir, filename)
      fs.stat(pathname, (err, stats) => { // 读取文件信息
        if (err) {
          console.log('获取文件stats失败')
          return
        }
        fs.readFile(pathname, (err, data) => {
          if (err) {
            console.error(err)
            return
          }
         callback && callback(data, pathname, files.length)
        })
      })
    }
  })
}

