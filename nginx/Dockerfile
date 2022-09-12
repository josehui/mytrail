FROM nginx:alpine

# Remove existing config files
RUN rm /etc/nginx/conf.d/*

# # Copy config files
# COPY ./conf/default.conf /etc/nginx/conf.d/
# Copy config files for aca
COPY ./conf/on-aca.conf /etc/nginx/conf.d/default.conf

# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]
