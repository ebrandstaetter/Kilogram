package at.htl;

import at.htl.model.Post;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

@Path("/")
public class PostResource {

    @Inject
    PostRepository postRepository;

    @GET
    @Path("/getAllPosts")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Post> getAllPosts() {
        return postRepository.listAll();
    }

    @GET
    @Path("/getPost/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Post getPost(@PathParam("id") Long id) {
        return postRepository.findById(id);
    }

    @POST
    @Transactional
    @Path("/addPost")
    public Response addPost(Post post) {
        postRepository.persist(post);
        return Response.ok().build();
    }

    @POST
    @Transactional
    @Path("updatePost")
    public Response updatePost(Post newPost) {
        Post oldPost = postRepository.findById(newPost.id);
        if(oldPost != null) {
            newPost.imgLink = oldPost.imgLink;
            oldPost = newPost;
        }
        return Response.ok().build();
    }
}