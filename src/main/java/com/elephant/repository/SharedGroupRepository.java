package com.elephant.repository;

import com.elephant.model.SharedGroup;
import com.elephant.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedGroupRepository extends JpaRepository<SharedGroup, Long> {

    List<SharedGroup> findByCreator(User creator);

    // Groups where user is a member
    @Query("SELECT gm.group FROM GroupMember gm WHERE gm.user = :user")
    List<SharedGroup> findGroupsByMember(@Param("user") User user);

    // All groups the user is involved in (created or member)
    @Query("SELECT DISTINCT g FROM SharedGroup g LEFT JOIN g.members gm WHERE g.creator = :user OR gm.user = :user")
    List<SharedGroup> findAllGroupsForUser(@Param("user") User user);
}
