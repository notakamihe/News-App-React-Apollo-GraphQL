import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom"
import {Home, Register, Login, ArticleCreate, ArticleDetail, ArticleList, ArticleUpdate, CommentDetail, CommentUpdate, TagCreate, 
  TagDetail, TagUpdate, TagList, UserDetail, UserUpdate} from "./pages"
import {NotFound} from "./components"

const App : React.FC = () => {
  return (
   <div>
     <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/users/:id" component={UserDetail} />
        <Route exact path="/users/:id/edit" component={UserUpdate} />

        <Route exact path="/articles" component={ArticleList}/>
        <Route exact path="/articles/new" component={ArticleCreate}/>
        <Route exact path="/articles/:id" component={ArticleDetail}/>
        <Route exact path="/articles/:id/edit" component={ArticleUpdate}/>
        <Route exact path="/articles/:articleId/comments/:commentId" component={CommentDetail}/>
        <Route exact path="/articles/:articleId/comments/:commentId/edit" component={CommentUpdate}/>

        <Route exact path="/tags" component={TagList}/>
        <Route exact path="/tags/new" component={TagCreate}/>
        <Route exact path="/tags/:name" component={TagDetail}/>
        <Route exact path="/tags/:name/edit" component={TagUpdate}/>

        <Route component={NotFound} />
      </Switch>
     </BrowserRouter>
   </div> 
  )
}

export default App