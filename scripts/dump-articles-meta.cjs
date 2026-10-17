const path=require("path");
const root=process.argv[2];
const jiti=require(path.join(root,"node_modules/jiti"))(root+"/", {alias:{"@":root}});
const A=jiti("./lib/articles.ts");
const out=A.articles.map(a=>({slug:a.slug,title:a.title,category:a.category,keywords:a.keywords,description:a.description,path:"/articles/"+A.articlePublicSlug(a)}));
require("fs").writeFileSync(process.argv[3],JSON.stringify(out,null,1));
console.log(out.length, new Set(out.map(o=>o.category)).size);
