package at.htl.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;
import java.util.List;

public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String title;
    public List<String> ingredients;
    public List<String> tags;
    public String description;
    public String preparation;
    public Date date;
    public String imgLink;
}